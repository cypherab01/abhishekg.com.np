import Link from "next/link";
import { Plus, Pencil, Star, Settings2, FolderGit2 } from "lucide-react";
import { getProjects } from "@/db/queries";
import { deleteProject } from "../actions";
import { DeleteButton } from "../_components/delete-button";
import { PageHeader, Pill } from "../_components/ui";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Your portfolio projects. Featured ones appear on the home page."
        action={
          <div className="flex items-center gap-2">
            <Link
              href="/admin/projects/categories"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              <Settings2 className="size-4 mr-1.5" />
              Manage categories
            </Link>
            <Link
              href="/admin/projects/new"
              className={cn(buttonVariants({ variant: "default" }))}
            >
              <Plus className="size-4 mr-1.5" />
              Add project
            </Link>
          </div>
        }
      />

      {projects.length === 0 ? (
        <div className="card-elevated flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <FolderGit2 className="size-6" aria-hidden />
          </span>
          <div>
            <p className="font-medium text-foreground">No projects yet</p>
            <p className="text-sm text-muted-foreground">
              Add your first project to show it on your portfolio.
            </p>
          </div>
          <Link
            href="/admin/projects/new"
            className={cn(buttonVariants({ variant: "default" }))}
          >
            <Plus className="size-4 mr-1.5" />
            Add project
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="card-elevated flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/30"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate font-medium text-foreground">
                    {project.name}
                  </p>
                  {project.featured && (
                    <Pill tone="accent">
                      <Star className="size-3 fill-current" />
                      Featured
                    </Pill>
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
                  aria-label={`Edit ${project.name}`}
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
      )}
    </div>
  );
}
