import Link from "next/link";
import { Plus, Settings2, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button-variants";
import { getSkillCategoryList, getSkillGroups } from "@/db/queries";
import { PageHeader } from "../_components/ui";
import { SkillsList } from "./skills-list";

export default async function AdminSkillsPage() {
  const [categories, skillGroups] = await Promise.all([
    getSkillCategoryList(),
    getSkillGroups(),
  ]);

  const hasCategories = categories.length > 0;
  const hasSkills = skillGroups.some((group) => group.items.length > 0);

  return (
    <div>
      <PageHeader
        title="Skills & Tools"
        description="Your skills, grouped by category."
        action={
          <div className="flex items-center gap-2">
            <Link
              href="/admin/skills/categories"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              <Settings2 className="size-4 mr-1.5" />
              Manage categories
            </Link>
            {hasCategories && (
              <Link
                href="/admin/skills/new"
                className={cn(buttonVariants({ variant: "default" }))}
              >
                <Plus className="size-4 mr-1.5" />
                Add skill
              </Link>
            )}
          </div>
        }
      />

      {!hasCategories ? (
        <div className="card-elevated flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Wrench className="size-6" aria-hidden />
          </span>
          <div>
            <p className="font-medium text-foreground">
              Create a category first
            </p>
            <p className="text-sm text-muted-foreground">
              Skills are grouped by category — add one before adding skills.
            </p>
          </div>
          <Link
            href="/admin/skills/categories"
            className={cn(buttonVariants({ variant: "default" }))}
          >
            <Settings2 className="size-4 mr-1.5" />
            Manage categories
          </Link>
        </div>
      ) : !hasSkills ? (
        <div className="card-elevated flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Wrench className="size-6" aria-hidden />
          </span>
          <div>
            <p className="font-medium text-foreground">No skills yet</p>
            <p className="text-sm text-muted-foreground">
              Add your first skill to one of your categories.
            </p>
          </div>
          <Link
            href="/admin/skills/new"
            className={cn(buttonVariants({ variant: "default" }))}
          >
            <Plus className="size-4 mr-1.5" />
            Add skill
          </Link>
        </div>
      ) : (
        <SkillsList groups={skillGroups} />
      )}
    </div>
  );
}
