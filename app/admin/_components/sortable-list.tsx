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
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
  arrayMove,
  type SortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TableShell } from "./ui";

/** Props to spread onto the drag-handle element (from @dnd-kit's useSortable). */
export type DragHandleProps = ReturnType<typeof useSortable>["attributes"] &
  NonNullable<ReturnType<typeof useSortable>["listeners"]>;

function SortableItem({
  id,
  as: Element = "div",
  className,
  children,
}: {
  id: number;
  /** Element to render the row as — `tr` when the list is a table body. */
  as?: "div" | "tr" | "li";
  className?: string | ((isDragging: boolean) => string);
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
    <Element
      ref={setNodeRef}
      style={style}
      className={
        typeof className === "function" ? className(isDragging) : className
      }
    >
      {children(
        { ...attributes, ...(listeners ?? {}) } as DragHandleProps,
        isDragging,
      )}
    </Element>
  );
}

/**
 * Shared reorder state. Reordering is optimistic: the new order shows at once
 * and `onReorder` is called with the id order after a drag that moved
 * something.
 */
function useReorder<T extends { id: number }>(
  items: T[],
  onReorder: (ids: number[]) => void | Promise<void>,
) {
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

  return { order, sensors, handleDragEnd };
}

/**
 * Generic drag-to-reorder list backed by @dnd-kit (same library the resume
 * builder uses).
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
  const { order, sensors, handleDragEnd } = useReorder(items, onReorder);

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

/**
 * The same thing as a table. The whole table — shell included — is rendered
 * *inside* DndContext rather than the other way round: DndContext is not
 * DOM-free, it mounts a hidden live region for screen-reader announcements,
 * and a stray <div> between <table> and <tbody> is invalid HTML that the
 * browser relocates, which shows up as a hydration error.
 *
 * `head` is the header row; `children` renders the cells of one body row.
 */
export function SortableTable<T extends { id: number }>({
  items,
  onReorder,
  head,
  rowClassName,
  children,
}: {
  items: T[];
  onReorder: (ids: number[]) => void | Promise<void>;
  head: ReactNode;
  rowClassName?: string | ((isDragging: boolean) => string);
  children: (
    item: T,
    dragHandleProps: DragHandleProps,
    isDragging: boolean,
  ) => ReactNode;
}) {
  const dndId = useId();
  const { order, sensors, handleDragEnd } = useReorder(items, onReorder);

  return (
    <DndContext
      id={dndId}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      {/* Rows sort vertically, so the list strategy rather than the grid one. */}
      <SortableContext
        items={order.map((i) => i.id)}
        strategy={verticalListSortingStrategy}
      >
        <TableShell>
          <thead>{head}</thead>
          <tbody>
            {order.map((item) => (
              <SortableItem
                key={item.id}
                id={item.id}
                as="tr"
                className={rowClassName}
              >
                {(handleProps, isDragging) =>
                  children(item, handleProps, isDragging)
                }
              </SortableItem>
            ))}
          </tbody>
        </TableShell>
      </SortableContext>
    </DndContext>
  );
}
