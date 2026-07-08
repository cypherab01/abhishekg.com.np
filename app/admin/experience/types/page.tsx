import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { getExperienceKindList, getExperienceGroups } from "@/db/queries";
import { deleteExperienceKind, saveExperienceKind } from "../../actions";
import { DeleteButton } from "../../_components/delete-button";
import { PageHeader, Alert, Pill, inputClass } from "../../_components/ui";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

export default async function ExperienceTypesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ error }, kinds, groups] = await Promise.all([
    searchParams,
    getExperienceKindList(),
    getExperienceGroups(),
  ]);

  const countByKindId = new Map<number, number>(
    groups.map((group) => [group.id, group.items.length]),
  );

  return (
    <div>
      <Link
        href="/admin/experience"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to experience
      </Link>

      <PageHeader
        title="Experience types"
        description="The categories in the experience form's dropdown. Types with entries can't be deleted until those entries are moved or removed."
      />

      {error && (
        <Alert tone="error" icon={<AlertTriangle className="size-4" />}>
          {error}
        </Alert>
      )}

      <div className="card-elevated space-y-5 rounded-2xl border border-border bg-card p-5">
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
          <div className="space-y-1.5 sm:w-28">
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

        <div className="space-y-2 border-t border-border pt-5">
          {kinds.map((kind) => {
            const count = countByKindId.get(kind.id) ?? 0;
            return (
              <div
                key={kind.id}
                className="flex flex-col gap-2 rounded-xl border border-border bg-background/50 p-3 sm:flex-row sm:items-end"
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
                  <div className="space-y-1.5 sm:w-28">
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
                <div className="flex items-center gap-2 sm:justify-end sm:pb-0.5">
                  <Pill tone={count > 0 ? "accent" : "neutral"}>
                    {count} {count === 1 ? "entry" : "entries"}
                  </Pill>
                  <form action={deleteExperienceKind}>
                    <input type="hidden" name="id" value={kind.id} />
                    <DeleteButton compact confirmLabel={`Delete type "${kind.name}"?`} />
                  </form>
                </div>
              </div>
            );
          })}
          {kinds.length === 0 && (
            <p className="text-sm text-muted-foreground">No types yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
