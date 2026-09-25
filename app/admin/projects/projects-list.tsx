"use client";

import Link from "next/link";
import { Pencil, Star, GripVertical } from "lucide-react";
import { toast } from "sonner";
import type { Project } from "@/db/schema";
import { deleteProject, reorderProjects } from "../actions";
import { DeleteButton } from "../_components/delete-button";
import { SortableTable } from "../_components/sortable-list";
import { Pill, thClass, tdClass, trClass } from "../_components/ui";
import { cn } from "@/lib/utils";

export function ProjectsList({
  projects,
  categories,
}: {
  projects: Project[];
  categories: { id: number; name: string }[];
}) {
  const categoryName = (id: number) =>
    categories.find((c) => c.id === id)?.name ?? "—";

  async function handleReorder(ids: number[]) {
    try {
      await reorderProjects(ids);
      toast.success("Order updated");
    } catch {
      toast.error("Couldn't save the new order");
    }
  }

  async function handleDelete(formData: FormData) {
    const name = String(formData.get("name") ?? "");
    try {
      await deleteProject(formData);
      toast.success(name ? `Deleted "${name}"` : "Project deleted");
    } catch {
      toast.error("Couldn't delete the project");
    }
  }

  return (
    <SortableTable
      items={projects}
      onReorder={handleReorder}
      rowClassName={(isDragging) =>
        cn(trClass, isDragging && "bg-surface-sunken")
      }
      head={
        <tr>
          {/* The handle column has no label — the icon is the whole cell. */}
          <th className={cn(thClass, "w-10")}>
            <span className="sr-only">Reorder</span>
          </th>
          <th className={thClass}>Project</th>
          <th className={cn(thClass, "hidden md:table-cell")}>Category</th>
          <th className={cn(thClass, "hidden lg:table-cell")}>Status</th>
          <th className={cn(thClass, "hidden lg:table-cell")}>Screens</th>
          <th className={cn(thClass, "w-24 text-right")}>Actions</th>
        </tr>
      }
    >
      {(project, handleProps) => (
        <>
          <td className={cn(tdClass, "w-10 pr-0")}>
            <button
              type="button"
              {...handleProps}
              className="cursor-grab touch-none rounded-md p-1 text-muted-foreground/60 hover:bg-muted hover:text-foreground active:cursor-grabbing"
              aria-label={`Reorder ${project.name}`}
            >
              <GripVertical className="size-4" />
            </button>
          </td>

          <td className={tdClass}>
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/projects/${project.id}`}
                className="font-medium text-foreground hover:underline"
              >
                {project.name}
              </Link>
              {project.featured && (
                <Pill tone="accent">
                  <Star className="size-3 fill-current" />
                  Featured
                </Pill>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{project.slug}</p>
          </td>

          <td
            className={cn(tdClass, "hidden text-muted-foreground md:table-cell")}
          >
            {categoryName(project.categoryId)}
          </td>

          <td className={cn(tdClass, "hidden lg:table-cell")}>
            {project.status ? (
              <Pill>{project.status}</Pill>
            ) : (
              <span className="text-muted-foreground">—</span>
            )}
          </td>

          <td
            className={cn(tdClass, "hidden text-muted-foreground lg:table-cell")}
          >
            {project.images.length}
          </td>

          <td className={cn(tdClass, "w-24")}>
            <div className="flex items-center justify-end gap-1">
              <Link
                href={`/admin/projects/${project.id}`}
                className="state-layer rounded-full p-2 text-muted-foreground hover:text-foreground"
                aria-label={`Edit ${project.name}`}
              >
                <Pencil className="size-4" />
              </Link>
              <form action={handleDelete}>
                <input type="hidden" name="id" value={project.id} />
                <input type="hidden" name="name" value={project.name} />
                <DeleteButton
                  compact
                  confirmLabel={`Delete "${project.name}"?`}
                />
              </form>
            </div>
          </td>
        </>
      )}
    </SortableTable>
  );
}
