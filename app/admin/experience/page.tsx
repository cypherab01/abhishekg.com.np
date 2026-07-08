import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import {
  getExperienceGroups,
  getExperienceKindList,
} from "@/db/queries";
import {
  deleteExperience,
  deleteExperienceKind,
  saveExperienceKind,
} from "../actions";
import { DeleteButton } from "../_components/delete-button";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary/50";

export default async function AdminExperiencePage() {
  const [kinds, experienceGroups] = await Promise.all([
    getExperienceKindList(),
    getExperienceGroups(),
  ]);

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
        Manage experience types and the entries that belong to them.
      </p>

      <div className="mb-10 rounded-lg border border-border p-4 space-y-4">
        <div>
          <p className="text-sm font-medium text-foreground">Experience types</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Create, rename, or delete the dropdown options used by the form.
          </p>
        </div>

        <form action={saveExperienceKind} className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1 space-y-1.5">
            <label className="text-sm font-medium text-foreground" htmlFor="new-experience-kind">
              New type
            </label>
            <input
              id="new-experience-kind"
              name="name"
              placeholder="volunteering"
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5 sm:w-32">
            <label className="text-sm font-medium text-foreground" htmlFor="new-experience-kind-order">
              Order
            </label>
            <input
              id="new-experience-kind-order"
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
            Add type
          </button>
        </form>

        <div className="space-y-2">
          {kinds.map((kind) => (
            <div
              key={kind.id}
              className="flex flex-col gap-2 rounded-lg border border-border p-3 sm:flex-row sm:items-end"
            >
              <form action={saveExperienceKind} className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-end">
                <input type="hidden" name="id" value={kind.id} />
                <div className="flex-1 space-y-1.5">
                  <label className="text-sm font-medium text-foreground" htmlFor={`experience-kind-${kind.id}`}>
                    Type name
                  </label>
                  <input
                    id={`experience-kind-${kind.id}`}
                    name="name"
                    defaultValue={kind.name}
                    className={inputClass}
                  />
                </div>
                <div className="space-y-1.5 sm:w-32">
                  <label className="text-sm font-medium text-foreground" htmlFor={`experience-kind-order-${kind.id}`}>
                    Order
                  </label>
                  <input
                    id={`experience-kind-order-${kind.id}`}
                    name="sortOrder"
                    type="number"
                    defaultValue={kind.sortOrder}
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
              <form action={deleteExperienceKind}>
                <input type="hidden" name="id" value={kind.id} />
                <DeleteButton compact confirmLabel={`Delete type "${kind.name}"?`} />
              </form>
            </div>
          ))}
          {kinds.length === 0 && (
            <p className="text-sm text-muted-foreground">No types yet.</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {experienceGroups.length === 0 && (
          <p className="text-sm text-muted-foreground">No entries yet.</p>
        )}
        {experienceGroups.map((group) => (
          <div key={group.id} className="space-y-3">
            <p className="text-sm font-medium text-primary">{group.label}</p>
            <div className="space-y-2">
              {group.items.map((exp) => (
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
                        {group.kind}
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
        ))}
      </div>
    </div>
  );
}
