"use client";

import Link from "next/link";
import { Pencil, GripVertical } from "lucide-react";
import { toast } from "sonner";
import type { Skill } from "@/db/schema";
import { deleteSkill, reorderSkills } from "../actions";
import { DeleteButton } from "../_components/delete-button";
import { SortableList } from "../_components/sortable-list";
import { cn } from "@/lib/utils";

type SkillGroup = {
  id: number;
  label: string;
  items: Skill[];
};

export function SkillsList({ groups }: { groups: SkillGroup[] }) {
  async function handleReorder(ids: number[]) {
    try {
      await reorderSkills(ids);
      toast.success("Order updated");
    } catch {
      toast.error("Couldn't save the new order");
    }
  }

  async function handleDelete(formData: FormData) {
    const name = String(formData.get("name") ?? "");
    try {
      await deleteSkill(formData);
      toast.success(name ? `Deleted "${name}"` : "Skill deleted");
    } catch {
      toast.error("Couldn't delete the skill");
    }
  }

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <section key={group.id}>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {group.label}
          </p>
          <SortableList
            items={group.items}
            onReorder={handleReorder}
            className="flex flex-wrap gap-2"
          >
            {(skill, handleProps, isDragging) => (
              <div
                className={cn(
                  "flex items-center gap-1 rounded-full border border-border bg-card py-1 pl-1.5 pr-1.5 text-sm text-foreground shadow-sm transition-colors hover:border-primary/40",
                  isDragging && "border-primary/60 opacity-60",
                )}
              >
                <button
                  type="button"
                  {...handleProps}
                  className="cursor-grab touch-none rounded-full p-0.5 text-muted-foreground/60 hover:text-foreground active:cursor-grabbing"
                  aria-label="Drag to reorder"
                >
                  <GripVertical className="size-3.5" />
                </button>
                <span>{skill.name}</span>
                <Link
                  href={`/admin/skills/${skill.id}`}
                  className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label={`Edit ${skill.name}`}
                >
                  <Pencil className="size-3.5" />
                </Link>
                <form action={handleDelete}>
                  <input type="hidden" name="id" value={skill.id} />
                  <input type="hidden" name="name" value={skill.name} />
                  <DeleteButton compact confirmLabel={`Delete "${skill.name}"?`} />
                </form>
              </div>
            )}
          </SortableList>
        </section>
      ))}
    </div>
  );
}
