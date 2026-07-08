import Link from "next/link";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button-variants";
import {
  getSkillCategoryList,
  getSkillGroups,
} from "@/db/queries";
import {
  deleteSkill,
  deleteSkillCategory,
  saveSkillCategory,
} from "../actions";
import { DeleteButton } from "../_components/delete-button";
import { SkillForm } from "./skill-form";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary/50";

export default async function AdminSkillsPage() {
  const [categories, skillGroups] = await Promise.all([
    getSkillCategoryList(),
    getSkillGroups(),
  ]);

  const countByCategoryId = new Map(
    skillGroups.map((group) => [group.id, group.items.length]),
  );

  return (
    <div>
      <h1 className="text-2xl font-light text-foreground">Skills &amp; Tools</h1>
      <p className="mt-1 mb-8 text-sm text-muted-foreground">
        Grouped by category. Manage categories first, then add skills to them.
      </p>

      <div className="mb-10 space-y-4 rounded-lg border border-border p-4">
        <div>
          <p className="text-sm font-medium text-foreground">Skill categories</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Add, rename, or remove the categories used by the skill form.
          </p>
        </div>

        <form action={saveSkillCategory} className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1 space-y-1.5">
            <label className="text-sm font-medium text-foreground" htmlFor="new-category-name">
              New category
            </label>
            <input
              id="new-category-name"
              name="name"
              placeholder="Design Systems"
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            className={cn(buttonVariants({ variant: "default" }), "sm:self-end")}
          >
            Add category
          </button>
        </form>

        <div className="space-y-2">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex flex-col gap-2 rounded-lg border border-border p-3 sm:flex-row sm:items-end"
            >
              <form action={saveSkillCategory} className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-end">
                <input type="hidden" name="id" value={category.id} />
                <input type="hidden" name="sortOrder" value={category.sortOrder} />
                <div className="flex-1 space-y-1.5">
                  <label className="text-sm font-medium text-foreground" htmlFor={`category-${category.id}`}>
                    Category name
                  </label>
                  <input
                    id={`category-${category.id}`}
                    name="name"
                    defaultValue={category.name}
                    className={inputClass}
                  />
                </div>
                <button
                  type="submit"
                  className={cn(buttonVariants({ variant: "outline" }), "sm:self-end")}
                >
                  Save
                </button>
              </form>
              <div className="flex items-center gap-2 sm:justify-end">
                <span className="text-xs text-muted-foreground">
                  {countByCategoryId.get(category.id) ?? 0} skills
                </span>
                <form action={deleteSkillCategory}>
                  <input type="hidden" name="id" value={category.id} />
                  <DeleteButton
                    compact
                    confirmLabel={`Delete category "${category.name}" and its skills?`}
                  />
                </form>
              </div>
            </div>
          ))}
          {categories.length === 0 && (
            <p className="text-sm text-muted-foreground">No categories yet.</p>
          )}
        </div>
      </div>

      <div className="mb-10 rounded-lg border border-border p-4">
        <p className="mb-4 text-sm font-medium text-foreground">Add a skill</p>
        <SkillForm categories={categories} />
      </div>

      <div className="space-y-6">
        {skillGroups.map((group) => (
          <div key={group.id}>
            <p className="mb-2 text-sm font-medium text-primary">{group.label}</p>
            <div className="flex flex-wrap gap-2">
              {group.items.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center gap-1 rounded-md border border-border py-1 pl-3 pr-1 text-sm text-foreground"
                >
                  <span>{skill.name}</span>
                  <Link
                    href={`/admin/skills/${skill.id}`}
                    className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                    aria-label="Edit"
                  >
                    <Pencil className="size-3.5" />
                  </Link>
                  <form action={deleteSkill}>
                    <input type="hidden" name="id" value={skill.id} />
                    <DeleteButton compact confirmLabel={`Delete "${skill.name}"?`} />
                  </form>
                </div>
              ))}
            </div>
          </div>
        ))}
        {skillGroups.length === 0 && (
          <p className="text-sm text-muted-foreground">No skills yet.</p>
        )}
      </div>
    </div>
  );
}
