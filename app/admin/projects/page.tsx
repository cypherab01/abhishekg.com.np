import Link from "next/link";
import { Plus, Settings2, FolderGit2 } from "lucide-react";
import { getProjects } from "@/db/queries";
import { PageHeader } from "../_components/ui";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { ProjectsList } from "./projects-list";

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
        <ProjectsList projects={projects} />
      )}
    </div>
  );
}
