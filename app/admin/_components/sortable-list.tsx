"use client";

import { useId, useState, type ReactNode } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
  arrayMove,
  type SortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/** Props to spread onto the drag-handle element (from @dnd-kit's useSortable). */
export type DragHandleProps = ReturnType<typeof useSortable>["attributes"] &
  NonNullable<ReturnType<typeof useSortable>["listeners"]>;

function SortableItem({
  id,
  children,
}: {
  id: number;
  children: (handleProps: DragHandleProps, isDragging: boolean) => ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
    position: "relative" as const,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children(
        { ...attributes, ...(listeners ?? {}) } as DragHandleProps,
        isDragging,
      )}
    </div>
  );
}

/**
 * Generic drag-to-reorder list backed by @dnd-kit (same library the resume
 * builder uses). Reordering is optimistic; `onReorder` is called with the new
 * id order once a drag completes and the order actually changed.
 */
export function SortableList<T extends { id: number }>({
  items,
  onReorder,
  className,
  strategy = rectSortingStrategy,
  children,
}: {
  items: T[];
  onReorder: (ids: number[]) => void | Promise<void>;
  className?: string;
  strategy?: SortingStrategy;
  children: (
    item: T,
    dragHandleProps: DragHandleProps,
    isDragging: boolean,
  ) => ReactNode;
}) {
  const dndId = useId();
  const [order, setOrder] = useState<T[]>(items);

  // Sync local state when the server sends a new list (add/delete/reorder).
  // Official React pattern for adjusting state on prop change during render.
  const [prevItems, setPrevItems] = useState(items);
  if (items !== prevItems) {
    setPrevItems(items);
    setOrder(items);
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = order.findIndex((i) => i.id === active.id);
    const newIndex = order.findIndex((i) => i.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const next = arrayMove(order, oldIndex, newIndex);
    setOrder(next);
    void onReorder(next.map((i) => i.id));
  }

  return (
    <DndContext
      id={dndId}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={order.map((i) => i.id)} strategy={strategy}>
        <div className={className}>
          {order.map((item) => (
            <SortableItem key={item.id} id={item.id}>
              {(handleProps, isDragging) =>
                children(item, handleProps, isDragging)
              }
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
