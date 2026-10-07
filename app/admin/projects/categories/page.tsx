import Link from "next/link";
import { ArrowLeft, AlertTriangle, Plus } from "lucide-react";
import { getProjectCategories, getProjects } from "@/db/queries";
import { saveProjectCategory } from "../../actions";
import { FlashToast } from "../../_components/flash-toast";
import { PageHeader, Alert, inputClass } from "../../_components/ui";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { CategoriesList } from "./categories-list";

export default async function ProjectCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const [{ error, saved }, categories, projects] = await Promise.all([
    searchParams,
    getProjectCategories(),
    getProjects(),
  ]);

  // A plain object, not a Map: it crosses into a client component.
  const countByCategoryId: Record<number, number> = {};
  for (const project of projects) {
    countByCategoryId[project.categoryId] =
      (countByCategoryId[project.categoryId] ?? 0) + 1;
  }

  return (
    <div>
      {saved && <FlashToast message="Project category saved" />}
      <Link
        href="/admin/projects"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to projects
      </Link>

      <PageHeader
        title="Project categories"
        description="The labels used to group projects. Drag to set their order. A category with projects in it can't be deleted until those projects are moved or removed."
      />

      {error && (
        <Alert tone="error" icon={<AlertTriangle className="size-4" />}>
          {error}
        </Alert>
      )}

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
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
              required
              placeholder="Mobile App"
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
          <CategoriesList
            categories={categories}
            countByCategoryId={countByCategoryId}
          />
          {categories.length === 0 && (
            <p className="px-1 py-6 text-center text-sm text-muted-foreground">
              No categories yet. Add your first one above.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
