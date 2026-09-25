import Link from "next/link";
import { Plus, Pencil, Settings2, Briefcase } from "lucide-react";
import { getExperienceGroups } from "@/db/queries";
import { deleteExperience } from "../actions";
import { DeleteButton } from "../_components/delete-button";
import {
  PageHeader,
  Pill,
  TableShell,
  thClass,
  tdClass,
  trClass,
} from "../_components/ui";
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
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
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
          {experienceGroups
            // A type with nothing in it has no table to show.
            .filter((group) => group.items.length > 0)
            .map((group) => (
              <section key={group.id} className="space-y-3">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {group.label}
                  </p>
                  <Pill>{group.items.length}</Pill>
                </div>

                <TableShell>
                  <thead>
                    <tr>
                      <th className={thClass}>Role</th>
                      <th className={cn(thClass, "hidden md:table-cell")}>
                        Company
                      </th>
                      <th className={cn(thClass, "hidden lg:table-cell")}>
                        Location
                      </th>
                      <th className={cn(thClass, "hidden sm:table-cell")}>
                        Period
                      </th>
                      <th className={cn(thClass, "w-24 text-right")}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.items.map((exp) => (
                      <tr key={exp.id} className={trClass}>
                        <td className={tdClass}>
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/admin/experience/${exp.id}`}
                              className="font-medium text-foreground hover:underline"
                            >
                              {exp.title}
                            </Link>
                            {exp.current && (
                              <Pill tone="success">Current</Pill>
                            )}
                          </div>
                          {/* Folded in for the widths that drop those
                              columns, so nothing is simply lost. */}
                          <p className="text-xs text-muted-foreground md:hidden">
                            {[exp.company, `${exp.startDate} – ${exp.endDate}`]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                        </td>

                        <td
                          className={cn(
                            tdClass,
                            "hidden text-muted-foreground md:table-cell",
                          )}
                        >
                          {exp.company || "—"}
                        </td>

                        <td
                          className={cn(
                            tdClass,
                            "hidden text-muted-foreground lg:table-cell",
                          )}
                        >
                          {exp.location || "—"}
                        </td>

                        <td
                          className={cn(
                            tdClass,
                            "hidden whitespace-nowrap text-muted-foreground sm:table-cell",
                          )}
                        >
                          {exp.startDate || exp.endDate
                            ? `${exp.startDate} – ${exp.endDate}`
                            : "—"}
                        </td>

                        <td className={cn(tdClass, "w-24")}>
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              href={`/admin/experience/${exp.id}`}
                              className="state-layer rounded-full p-2 text-muted-foreground hover:text-foreground"
                              aria-label={`Edit ${exp.title}`}
                            >
                              <Pencil className="size-4" />
                            </Link>
                            <form action={deleteExperience}>
                              <input type="hidden" name="id" value={exp.id} />
                              <DeleteButton
                                compact
                                confirmLabel={`Delete "${exp.title}"?`}
                              />
                            </form>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </TableShell>
              </section>
            ))}
        </div>
      )}
    </div>
  );
}
