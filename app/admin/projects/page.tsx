import Link from "next/link";
import { Plus, Pencil, Star } from "lucide-react";
import { getProjectCategories, getProjects } from "@/db/queries";
import {
  deleteProject,
  deleteProjectCategory,
  saveProjectCategory,
} from "../actions";
import { DeleteButton } from "../_components/delete-button";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary/50";

export default async function AdminProjectsPage() {
  const [projects, categories] = await Promise.all([
    getProjects(),
    getProjectCategories(),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-light text-foreground">Projects</h1>
        <Link
          href="/admin/projects/new"
          className={cn(buttonVariants({ variant: "default" }))}
        >
          <Plus className="size-4 mr-1.5" />
          Add
        </Link>
      </div>
      <p className="mt-1 mb-8 text-sm text-muted-foreground">
        Your portfolio projects. Featured ones appear on the home page.
      </p>

      <div className="mb-10 space-y-4 rounded-lg border border-border p-4">
        <div>
          <p className="text-sm font-medium text-foreground">Project categories</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Add, rename, or delete the labels used by project cards and forms.
          </p>
        </div>

        <form action={saveProjectCategory} className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1 space-y-1.5">
            <label className="text-sm font-medium text-foreground" htmlFor="new-project-category">
              New category
            </label>
            <input id="new-project-category" name="name" placeholder="Mobile App" className={inputClass} />
          </div>
          <div className="space-y-1.5 sm:w-32">
            <label className="text-sm font-medium text-foreground" htmlFor="new-project-category-order">
              Order
            </label>
            <input id="new-project-category-order" name="sortOrder" type="number" defaultValue={0} className={inputClass} />
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
                <div className="space-y-1.5 sm:w-32">
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
              <form action={deleteProjectCategory}>
                <input type="hidden" name="id" value={category.id} />
                <DeleteButton compact confirmLabel={`Delete category "${category.name}"?`} />
              </form>
            </div>
          ))}
          {categories.length === 0 && <p className="text-sm text-muted-foreground">No categories yet.</p>}
        </div>
      </div>

      <div className="space-y-2">
        {projects.length === 0 && (
          <p className="text-sm text-muted-foreground">No projects yet.</p>
        )}
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex items-center justify-between gap-3 rounded-lg border border-border p-4"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate font-medium text-foreground">
                  {project.name}
                </p>
                {project.featured && (
                  <Star className="size-3.5 shrink-0 fill-primary text-primary" />
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
                aria-label="Edit"
              >
                <Pencil className="size-4" />
              </Link>
              <form action={deleteProject}>
                <input type="hidden" name="id" value={project.id} />
                <DeleteButton
                  compact
                  confirmLabel={`Delete "${project.name}"?`}
                />
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
