import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { getProjectCategories, getProjects } from "@/db/queries";
import { deleteProjectCategory, saveProjectCategory } from "../../actions";
import { DeleteButton } from "../../_components/delete-button";
import { PageHeader, Alert, Pill, inputClass } from "../../_components/ui";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

export default async function ProjectCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ error }, categories, projects] = await Promise.all([
    searchParams,
    getProjectCategories(),
    getProjects(),
  ]);

  const countByCategoryId = new Map<number, number>();
  for (const project of projects) {
    countByCategoryId.set(
      project.categoryId,
      (countByCategoryId.get(project.categoryId) ?? 0) + 1,
    );
  }

  return (
    <div>
      <Link
        href="/admin/projects"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to projects
      </Link>

      <PageHeader
        title="Project categories"
        description="The labels used to group projects. Categories with projects can't be deleted until those projects are moved or removed."
      />

      {error && (
        <Alert tone="error" icon={<AlertTriangle className="size-4" />}>
          {error}
        </Alert>
      )}

      <div className="card-elevated space-y-5 rounded-2xl border border-border bg-card p-5">
        <form action={saveProjectCategory} className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1 space-y-1.5">
            <label className="text-sm font-medium text-foreground" htmlFor="new-project-category">
              New category
            </label>
            <input
              id="new-project-category"
              name="name"
              placeholder="Mobile App"
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5 sm:w-28">
            <label className="text-sm font-medium text-foreground" htmlFor="new-project-category-order">
              Order
            </label>
            <input
              id="new-project-category-order"
              name="sortOrder"
              type="number"
              defaultValue={0}
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
                <form
                  action={saveProjectCategory}
                  className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-end"
                >
                  <input type="hidden" name="id" value={category.id} />
                  <div className="flex-1 space-y-1.5">
                    <label className="text-sm font-medium text-foreground" htmlFor={`project-category-${category.id}`}>
                      Category name
                    </label>
                    <input
                      id={`project-category-${category.id}`}
                      name="name"
                      defaultValue={category.name}
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1.5 sm:w-28">
                    <label className="text-sm font-medium text-foreground" htmlFor={`project-category-order-${category.id}`}>
                      Order
                    </label>
                    <input
                      id={`project-category-order-${category.id}`}
                      name="sortOrder"
                      type="number"
                      defaultValue={category.sortOrder}
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
                    {count} {count === 1 ? "project" : "projects"}
                  </Pill>
                  <form action={deleteProjectCategory}>
                    <input type="hidden" name="id" value={category.id} />
                    <DeleteButton compact confirmLabel={`Delete category "${category.name}"?`} />
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
