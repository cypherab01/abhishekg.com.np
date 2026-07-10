"use client";

import Link from "next/link";
import { Pencil, GripVertical } from "lucide-react";
import { toast } from "sonner";
import type { Education } from "@/db/schema";
import { deleteEducation, reorderEducation } from "../actions";
import { DeleteButton } from "../_components/delete-button";
import { SortableList } from "../_components/sortable-list";
import { cn } from "@/lib/utils";

export function EducationList({ items }: { items: Education[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">No entries yet.</p>;
  }

  async function handleReorder(ids: number[]) {
    try {
      await reorderEducation(ids);
      toast.success("Order updated");
    } catch {
      toast.error("Couldn't save the new order");
    }
  }

  async function handleDelete(formData: FormData) {
    const degree = String(formData.get("degree") ?? "");
    try {
      await deleteEducation(formData);
      toast.success(degree ? `Deleted "${degree}"` : "Entry deleted");
    } catch {
      toast.error("Couldn't delete the entry");
    }
  }

  return (
    <SortableList
      items={items}
      onReorder={handleReorder}
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
    >
      {(edu, handleProps, isDragging) => (
        <div
          className={cn(
            "card-elevated flex items-center gap-2 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/30",
            isDragging && "border-primary/60 opacity-60",
          )}
        >
          <button
            type="button"
            {...handleProps}
            className="shrink-0 cursor-grab touch-none rounded-md p-1 text-muted-foreground/60 hover:bg-muted hover:text-foreground active:cursor-grabbing"
            aria-label="Drag to reorder"
          >
            <GripVertical className="size-4" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-foreground">{edu.degree}</p>
            <p className="truncate text-sm text-muted-foreground">
              {[edu.institution, `${edu.startDate} – ${edu.endDate}`]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Link
              href={`/admin/education/${edu.id}`}
              className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Edit"
            >
              <Pencil className="size-4" />
            </Link>
            <form action={handleDelete}>
              <input type="hidden" name="id" value={edu.id} />
              <input type="hidden" name="degree" value={edu.degree} />
              <DeleteButton compact confirmLabel={`Delete "${edu.degree}"?`} />
            </form>
          </div>
        </div>
      )}
    </SortableList>
  );
}
