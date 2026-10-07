"use client";

import { GripVertical, Tag } from "lucide-react";
import { toast } from "sonner";
import { verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { ExperienceKind } from "@/db/schema";
import {
  deleteExperienceKind,
  renameExperienceKind,
  reorderExperienceKinds,
} from "../../actions";
import { DeleteButton } from "../../_components/delete-button";
import { SortableList } from "../../_components/sortable-list";
import { Pill, rowInputClass } from "../../_components/ui";
import { cn } from "@/lib/utils";

export function TypesList({
  kinds,
  countByKindId,
}: {
  kinds: ExperienceKind[];
  countByKindId: Record<number, number>;
}) {
  async function handleReorder(ids: number[]) {
    try {
      await reorderExperienceKinds(ids);
      toast.success("Order updated");
    } catch {
      toast.error("Couldn't save the new order");
    }
  }

  return (
    <SortableList
      items={kinds}
      onReorder={handleReorder}
      strategy={verticalListSortingStrategy}
      className="space-y-1.5"
    >
      {(kind, handleProps, isDragging) => {
        const count = countByKindId[kind.id] ?? 0;
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
                aria-label={`Reorder ${kind.name}`}
              >
                <GripVertical className="size-4" />
              </button>
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Tag className="size-4" aria-hidden />
              </span>
            </div>
            <div className="flex-1">
              <label className="sr-only" htmlFor={`experience-kind-${kind.id}`}>
                Type name
              </label>
              <NameInput
                id={`experience-kind-${kind.id}`}
                kind={kind}
              />
            </div>
            <div className="flex items-center gap-2 pl-16 sm:pl-0">
              <Pill tone={count > 0 ? "accent" : "neutral"}>
                {count} {count === 1 ? "entry" : "entries"}
              </Pill>
              <form action={deleteExperienceKind}>
                <input type="hidden" name="id" value={kind.id} />
                <DeleteButton compact confirmLabel={`Delete type "${kind.name}"?`} />
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
  kind,
}: {
  id: string;
  kind: ExperienceKind;
}) {
  async function save(input: HTMLInputElement) {
    const name = input.value.trim();
    if (name === kind.name) return;
    if (!name) {
      input.value = kind.name;
      toast.error("Name is required");
      return;
    }
    try {
      await renameExperienceKind(kind.id, name);
      toast.success(`Renamed to "${name}"`);
    } catch {
      input.value = kind.name;
      toast.error("Couldn't rename the type");
    }
  }

  return (
    <input
      id={id}
      defaultValue={kind.name}
      className={rowInputClass}
      onBlur={(e) => void save(e.currentTarget)}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.currentTarget.blur();
        if (e.key === "Escape") {
          e.currentTarget.value = kind.name;
          e.currentTarget.blur();
        }
      }}
    />
  );
}
