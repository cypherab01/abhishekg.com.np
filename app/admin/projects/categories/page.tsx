import Link from "next/link";
import { ArrowLeft, AlertTriangle, FolderTree, Plus } from "lucide-react";
import { getProjectCategories, getProjects } from "@/db/queries";
import { deleteProjectCategory, saveProjectCategory } from "../../actions";
import { DeleteButton } from "../../_components/delete-button";
import { PageHeader, Alert, Pill, inputClass, rowInputClass } from "../../_components/ui";
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
        description="The labels used to group projects. A category with projects in it can't be deleted until those projects are moved or removed."
      />

      {error && (
        <Alert tone="error" icon={<AlertTriangle className="size-4" />}>
          {error}
        </Alert>
      )}

      <div className="card-elevated overflow-hidden rounded-2xl border border-border bg-card">
        <form
          action={saveProjectCategory}
          className="flex flex-col gap-3 border-b border-border bg-muted/30 p-5 sm:flex-row sm:items-end"
        >
          <div className="flex-1 space-y-1.5">
            <label className="text-sm font-medium text-foreground" htmlFor="new-project-category">
              Add a category
            </label>
            <input
              id="new-project-category"
              name="name"
              placeholder="Mobile App"
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5 sm:w-24">
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
            <Plus className="mr-1.5 size-4" />
            Add category
          </button>
        </form>

        <div className="p-3 sm:p-4">
          <p className="px-1 pb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {categories.length} {categories.length === 1 ? "category" : "categories"}
          </p>
          <div className="space-y-1.5">
            {categories.map((category) => {
              const count = countByCategoryId.get(category.id) ?? 0;
              return (
                <div
                  key={category.id}
                  className="group flex flex-col gap-2 rounded-xl border border-transparent p-2 transition-colors hover:border-border hover:bg-background/60 sm:flex-row sm:items-center sm:gap-3"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FolderTree className="size-4" aria-hidden />
                  </span>
                  <form
                    action={saveProjectCategory}
                    className="flex flex-1 items-center gap-2"
                  >
                    <input type="hidden" name="id" value={category.id} />
                    <label className="sr-only" htmlFor={`project-category-${category.id}`}>
                      Category name
                    </label>
                    <input
                      id={`project-category-${category.id}`}
                      name="name"
                      defaultValue={category.name}
                      className={rowInputClass}
                    />
                    <label className="sr-only" htmlFor={`project-category-order-${category.id}`}>
                      Order
                    </label>
                    <input
                      id={`project-category-order-${category.id}`}
                      name="sortOrder"
                      type="number"
                      defaultValue={category.sortOrder}
                      title="Sort order"
                      className={cn(rowInputClass, "w-16 text-center tabular-nums")}
                    />
                    <button
                      type="submit"
                      className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                    >
                      Save
                    </button>
                  </form>
                  <div className="flex items-center gap-2 pl-10 sm:pl-0">
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
              <p className="px-1 py-6 text-center text-sm text-muted-foreground">
                No categories yet. Add your first one above.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
