"use client";

import { useState, type ReactNode, type HTMLAttributes } from "react";

export type DragHandleProps = HTMLAttributes<HTMLElement>;

/**
 * Generic drag-to-reorder list backed by native HTML5 drag and drop.
 * Reordering is optimistic; `onReorder` is called with the new id order
 * once a drag completes and the order actually changed.
 */
export function SortableList<T extends { id: number }>({
  items,
  onReorder,
  className,
  children,
}: {
  items: T[];
  onReorder: (ids: number[]) => void | Promise<void>;
  className?: string;
  children: (
    item: T,
    dragHandleProps: DragHandleProps,
    isDragging: boolean,
  ) => ReactNode;
}) {
  const [order, setOrder] = useState<T[]>(items);
  const [dragId, setDragId] = useState<number | null>(null);

  // Sync local state when the server sends a new list (add/delete/reorder).
  // Official React pattern for adjusting state on prop change during render.
  const [prevItems, setPrevItems] = useState(items);
  if (items !== prevItems) {
    setPrevItems(items);
    setOrder(items);
  }

  const move = (fromId: number, toId: number) => {
    if (fromId === toId) return;
    setOrder((prev) => {
      const from = prev.findIndex((i) => i.id === fromId);
      const to = prev.findIndex((i) => i.id === toId);
      if (from === -1 || to === -1) return prev;
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  const handleDragEnd = () => {
    setDragId(null);
    const before = items.map((i) => i.id).join(",");
    const after = order.map((i) => i.id).join(",");
    if (before !== after) {
      void onReorder(order.map((i) => i.id));
    }
  };

  return (
    <div className={className}>
      {order.map((item) => {
        const isDragging = dragId === item.id;
        const handleProps: DragHandleProps = {
          draggable: true,
          onDragStart: (e) => {
            setDragId(item.id);
            e.dataTransfer.effectAllowed = "move";
          },
          onDragEnd: handleDragEnd,
        };
        return (
          <div
            key={item.id}
            onDragOver={(e) => {
              if (dragId === null || dragId === item.id) return;
              e.preventDefault();
              move(dragId, item.id);
            }}
            onDrop={(e) => e.preventDefault()}
          >
            {children(item, handleProps, isDragging)}
          </div>
        );
      })}
    </div>
  );
}
