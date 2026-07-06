import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { getAllExperiences } from "@/db/queries";
import { deleteExperience } from "../actions";
import { DeleteButton } from "../_components/delete-button";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

export default async function AdminExperiencePage() {
  const experiences = await getAllExperiences();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-light text-foreground">Experience</h1>
        <Link
          href="/admin/experience/new"
          className={cn(buttonVariants({ variant: "default" }))}
        >
          <Plus className="size-4 mr-1.5" />
          Add
        </Link>
      </div>
      <p className="mt-1 mb-8 text-sm text-muted-foreground">
        Work history and teaching engagements.
      </p>

      <div className="space-y-2">
        {experiences.length === 0 && (
          <p className="text-sm text-muted-foreground">No entries yet.</p>
        )}
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="flex items-center justify-between gap-3 rounded-lg border border-border p-4"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate font-medium text-foreground">
                  {exp.title}
                </p>
                <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground capitalize">
                  {exp.kind}
                </span>
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
                aria-label="Edit"
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
    </div>
  );
}
