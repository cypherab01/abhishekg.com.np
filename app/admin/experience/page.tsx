import Link from "next/link";
import { Plus, Pencil, Settings2, Briefcase } from "lucide-react";
import { getExperienceGroups } from "@/db/queries";
import { deleteExperience } from "../actions";
import { DeleteButton } from "../_components/delete-button";
import { PageHeader, Pill } from "../_components/ui";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

export default async function AdminExperiencePage() {
  const experienceGroups = await getExperienceGroups();

  const isEmpty = experienceGroups.every((group) => group.items.length === 0);

  return (
    <div>
      <PageHeader
        title="Experience"
        description="Your work history, grouped by type."
        action={
          <div className="flex items-center gap-2">
            <Link
              href="/admin/experience/types"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              <Settings2 className="size-4 mr-1.5" />
              Manage types
            </Link>
            <Link
              href="/admin/experience/new"
              className={cn(buttonVariants({ variant: "default" }))}
            >
              <Plus className="size-4 mr-1.5" />
              Add experience
            </Link>
          </div>
        }
      />

      {isEmpty ? (
        <div className="card-elevated flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Briefcase className="size-6" aria-hidden />
          </span>
          <div>
            <p className="font-medium text-foreground">No experience yet</p>
            <p className="text-sm text-muted-foreground">
              Add your first entry to build out your work history.
            </p>
          </div>
          <Link
            href="/admin/experience/new"
            className={cn(buttonVariants({ variant: "default" }))}
          >
            <Plus className="size-4 mr-1.5" />
            Add experience
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {experienceGroups.map((group) => (
            <section key={group.id} className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {group.label}
              </p>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {group.items.map((exp) => (
                  <div
                    key={exp.id}
                    className="card-elevated flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/30"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-medium text-foreground">
                          {exp.title}
                        </p>
                        <Pill tone="accent" className="capitalize">
                          {group.kind}
                        </Pill>
                      </div>
                      <p className="truncate text-sm text-muted-foreground">
                        {[exp.company, `${exp.startDate} – ${exp.endDate}`]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <Link
                        href={`/admin/experience/${exp.id}`}
                        className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                        aria-label={`Edit ${exp.title}`}
                      >
                        <Pencil className="size-4" />
                      </Link>
                      <form action={deleteExperience}>
                        <input type="hidden" name="id" value={exp.id} />
                        <DeleteButton compact confirmLabel={`Delete "${exp.title}"?`} />
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
