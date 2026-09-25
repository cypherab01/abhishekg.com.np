"use client";

import Link from "next/link";
import { Pencil, GripVertical } from "lucide-react";
import { toast } from "sonner";
import type { Education } from "@/db/schema";
import { deleteEducation, reorderEducation } from "../actions";
import { DeleteButton } from "../_components/delete-button";
import { SortableTable } from "../_components/sortable-list";
import { thClass, tdClass, trClass } from "../_components/ui";
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
    <SortableTable
      items={items}
      onReorder={handleReorder}
      rowClassName={(isDragging) =>
        cn(trClass, isDragging && "bg-surface-sunken")
      }
      head={
        <tr>
          <th className={cn(thClass, "w-10")}>
            <span className="sr-only">Reorder</span>
          </th>
          <th className={thClass}>Degree</th>
          <th className={cn(thClass, "hidden md:table-cell")}>Institution</th>
          <th className={cn(thClass, "hidden sm:table-cell")}>Period</th>
          <th className={cn(thClass, "w-24 text-right")}>Actions</th>
        </tr>
      }
    >
      {(edu, handleProps) => (
        <>
          <td className={cn(tdClass, "w-10 pr-0")}>
            <button
              type="button"
              {...handleProps}
              className="cursor-grab touch-none rounded-md p-1 text-muted-foreground/60 hover:bg-muted hover:text-foreground active:cursor-grabbing"
              aria-label={`Reorder ${edu.degree}`}
            >
              <GripVertical className="size-4" />
            </button>
          </td>

          <td className={tdClass}>
            <Link
              href={`/admin/education/${edu.id}`}
              className="font-medium text-foreground hover:underline"
            >
              {edu.degree}
            </Link>
            {/* The columns the narrow layout drops are folded in here rather
                than lost. */}
            <p className="text-xs text-muted-foreground md:hidden">
              {[edu.institution, `${edu.startDate} – ${edu.endDate}`]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </td>

          <td
            className={cn(tdClass, "hidden text-muted-foreground md:table-cell")}
          >
            {edu.institution || "—"}
          </td>

          <td
            className={cn(
              tdClass,
              "hidden whitespace-nowrap text-muted-foreground sm:table-cell",
            )}
          >
            {edu.startDate || edu.endDate
              ? `${edu.startDate} – ${edu.endDate}`
              : "—"}
          </td>

          <td className={cn(tdClass, "w-24")}>
            <div className="flex items-center justify-end gap-1">
              <Link
                href={`/admin/education/${edu.id}`}
                className="state-layer rounded-full p-2 text-muted-foreground hover:text-foreground"
                aria-label={`Edit ${edu.degree}`}
              >
                <Pencil className="size-4" />
              </Link>
              <form action={handleDelete}>
                <input type="hidden" name="id" value={edu.id} />
                <input type="hidden" name="degree" value={edu.degree} />
                <DeleteButton compact confirmLabel={`Delete "${edu.degree}"?`} />
              </form>
            </div>
          </td>
        </>
      )}
    </SortableTable>
  );
}
