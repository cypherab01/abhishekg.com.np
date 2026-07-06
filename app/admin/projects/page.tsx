import Link from "next/link";
import { Plus, Pencil, Star } from "lucide-react";
import { getProjects } from "@/db/queries";
import { deleteProject } from "../actions";
import { DeleteButton } from "../_components/delete-button";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

export default async function AdminProjectsPage() {
  const projects = await getProjects();

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
                {project.category || project.slug}
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
