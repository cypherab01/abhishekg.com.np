import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button-variants";
import { getSkillCategoryList, getSkillGroups } from "@/db/queries";
import { deleteSkillCategory, saveSkillCategory } from "../../actions";
import { DeleteButton } from "../../_components/delete-button";
import { PageHeader, Pill, inputClass } from "../../_components/ui";

export default async function SkillCategoriesPage() {
  const [categories, skillGroups] = await Promise.all([
    getSkillCategoryList(),
    getSkillGroups(),
  ]);

  const countByCategoryId = new Map(
    skillGroups.map((group) => [group.id, group.items.length]),
  );

  return (
    <div>
      <Link
        href="/admin/skills"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to skills
      </Link>

      <PageHeader
        title="Skill categories"
        description="The groups your skills are organized into. Deleting a category also removes the skills inside it."
      />

      <div className="card-elevated space-y-5 rounded-2xl border border-border bg-card p-5">
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

        <div className="space-y-2 border-t border-border pt-5">
          {categories.map((category) => {
            const count = countByCategoryId.get(category.id) ?? 0;
            return (
              <div
                key={category.id}
                className="flex flex-col gap-2 rounded-xl border border-border bg-background/50 p-3 sm:flex-row sm:items-end"
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
                <div className="flex items-center gap-2 sm:justify-end sm:pb-0.5">
                  <Pill tone={count > 0 ? "accent" : "neutral"}>
                    {count} {count === 1 ? "skill" : "skills"}
                  </Pill>
                  <form action={deleteSkillCategory}>
                    <input type="hidden" name="id" value={category.id} />
                    <DeleteButton
                      compact
                      confirmLabel={`Delete category "${category.name}" and its skills?`}
                    />
                  </form>
                </div>
              </div>
            );
          })}
          {categories.length === 0 && (
            <p className="text-sm text-muted-foreground">No categories yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
