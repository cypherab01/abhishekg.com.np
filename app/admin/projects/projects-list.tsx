"use client";

import Link from "next/link";
import { Pencil, Star, GripVertical } from "lucide-react";
import { toast } from "sonner";
import type { Project } from "@/db/schema";
import { deleteProject, reorderProjects } from "../actions";
import { DeleteButton } from "../_components/delete-button";
import { SortableList } from "../_components/sortable-list";
import { Pill } from "../_components/ui";
import { cn } from "@/lib/utils";

export function ProjectsList({ projects }: { projects: Project[] }) {
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
    <SortableList
      items={projects}
      onReorder={handleReorder}
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
    >
      {(project, handleProps, isDragging) => (
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
            <div className="flex items-center gap-2">
              <p className="truncate font-medium text-foreground">
                {project.name}
              </p>
              {project.featured && (
                <Pill tone="accent">
                  <Star className="size-3 fill-current" />
                  Featured
                </Pill>
              )}
            </div>
            <p className="truncate text-sm text-muted-foreground">
              {project.slug}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Link
              href={`/admin/projects/${project.id}`}
              className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label={`Edit ${project.name}`}
            >
              <Pencil className="size-4" />
            </Link>
            <form action={handleDelete}>
              <input type="hidden" name="id" value={project.id} />
              <input type="hidden" name="name" value={project.name} />
              <DeleteButton compact confirmLabel={`Delete "${project.name}"?`} />
            </form>
          </div>
        </div>
      )}
    </SortableList>
  );
}
