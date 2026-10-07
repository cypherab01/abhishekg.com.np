"use client";

import { FolderTree, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { ProjectCategory } from "@/db/schema";
import {
  deleteProjectCategory,
  renameProjectCategory,
  reorderProjectCategories,
} from "../../actions";
import { DeleteButton } from "../../_components/delete-button";
import { SortableList } from "../../_components/sortable-list";
import { Pill, rowInputClass } from "../../_components/ui";
import { cn } from "@/lib/utils";

export function CategoriesList({
  categories,
  countByCategoryId,
}: {
  categories: ProjectCategory[];
  countByCategoryId: Record<number, number>;
}) {
  async function handleReorder(ids: number[]) {
    try {
      await reorderProjectCategories(ids);
      toast.success("Order updated");
    } catch {
      toast.error("Couldn't save the new order");
    }
  }

  return (
    <SortableList
      items={categories}
      onReorder={handleReorder}
      strategy={verticalListSortingStrategy}
      className="space-y-1.5"
    >
      {(category, handleProps, isDragging) => {
        const count = countByCategoryId[category.id] ?? 0;
        return (
          <div
            className={cn(
              "group flex flex-col gap-2 rounded-xl border border-transparent p-2 transition-colors hover:border-border hover:bg-background/60 sm:flex-row sm:items-center sm:gap-3",
              isDragging && "border-border bg-surface-sunken",
            )}
          >
            <div className="flex items-center gap-1">
              <button
                type="button"
                {...handleProps}
                className="cursor-grab touch-none rounded-md p-1 text-muted-foreground/60 hover:bg-muted hover:text-foreground active:cursor-grabbing"
                aria-label={`Reorder ${category.name}`}
              >
                <GripVertical className="size-4" />
              </button>
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <FolderTree className="size-4" aria-hidden />
              </span>
            </div>
            <div className="flex-1">
              <label className="sr-only" htmlFor={`project-category-${category.id}`}>
                Category name
              </label>
              <NameInput
                id={`project-category-${category.id}`}
                category={category}
              />
            </div>
            <div className="flex items-center gap-2 pl-16 sm:pl-0">
              <Pill tone={count > 0 ? "accent" : "neutral"}>
                {count} {count === 1 ? "project" : "projects"}
              </Pill>
              <form action={deleteProjectCategory}>
                <input type="hidden" name="id" value={category.id} />
                <DeleteButton compact confirmLabel={`Delete category "${category.name}"?`} />
              </form>
            </div>
          </div>
        );
      }}
    </SortableList>
  );
}

/**
 * Saves when focus leaves the field (Enter blurs it), so there is no Save
 * button. Escape or an empty name puts the old name back.
 */
function NameInput({
  id,
  category,
}: {
  id: string;
  category: ProjectCategory;
}) {
  async function save(input: HTMLInputElement) {
    const name = input.value.trim();
    if (name === category.name) return;
    if (!name) {
      input.value = category.name;
      toast.error("Name is required");
      return;
    }
    try {
      await renameProjectCategory(category.id, name);
      toast.success(`Renamed to "${name}"`);
    } catch {
      input.value = category.name;
      toast.error("Couldn't rename the category");
    }
  }

  return (
    <input
      id={id}
      defaultValue={category.name}
      className={rowInputClass}
      onBlur={(e) => void save(e.currentTarget)}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.currentTarget.blur();
        if (e.key === "Escape") {
          e.currentTarget.value = category.name;
          e.currentTarget.blur();
        }
      }}
    />
  );
}
