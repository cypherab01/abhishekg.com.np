import Link from "next/link";
import { ArrowLeft, AlertTriangle, Tag, Plus } from "lucide-react";
import { getExperienceKindList, getExperienceGroups } from "@/db/queries";
import { deleteExperienceKind, saveExperienceKind } from "../../actions";
import { DeleteButton } from "../../_components/delete-button";
import { PageHeader, Alert, Pill, inputClass, rowInputClass } from "../../_components/ui";
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
        description="The categories in the experience form's dropdown. A type with entries in it can't be deleted until those entries are moved or removed."
      />

      {error && (
        <Alert tone="error" icon={<AlertTriangle className="size-4" />}>
          {error}
        </Alert>
      )}

      <div className="card-elevated overflow-hidden rounded-2xl border border-border bg-card">
        <form
          action={saveExperienceKind}
          className="flex flex-col gap-3 border-b border-border bg-muted/30 p-5 sm:flex-row sm:items-end"
        >
          <div className="flex-1 space-y-1.5">
            <label className="text-sm font-medium text-foreground" htmlFor="new-experience-kind">
              Add a type
            </label>
            <input
              id="new-experience-kind"
              name="name"
              placeholder="volunteering"
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5 sm:w-24">
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
            <Plus className="mr-1.5 size-4" />
            Add type
          </button>
        </form>

        <div className="p-3 sm:p-4">
          <p className="px-1 pb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {kinds.length} {kinds.length === 1 ? "type" : "types"}
          </p>
          <div className="space-y-1.5">
            {kinds.map((kind) => {
              const count = countByKindId.get(kind.id) ?? 0;
              return (
                <div
                  key={kind.id}
                  className="group flex flex-col gap-2 rounded-xl border border-transparent p-2 transition-colors hover:border-border hover:bg-background/60 sm:flex-row sm:items-center sm:gap-3"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Tag className="size-4" aria-hidden />
                  </span>
                  <form
                    action={saveExperienceKind}
                    className="flex flex-1 items-center gap-2"
                  >
                    <input type="hidden" name="id" value={kind.id} />
                    <label className="sr-only" htmlFor={`experience-kind-${kind.id}`}>
                      Type name
                    </label>
                    <input
                      id={`experience-kind-${kind.id}`}
                      name="name"
                      defaultValue={kind.name}
                      className={rowInputClass}
                    />
                    <label className="sr-only" htmlFor={`experience-kind-order-${kind.id}`}>
                      Order
                    </label>
                    <input
                      id={`experience-kind-order-${kind.id}`}
                      name="sortOrder"
                      type="number"
                      defaultValue={kind.sortOrder}
                      title="Sort order"
                      className={cn(rowInputClass, "w-16 text-center tabular-nums")}
                    />
                    <button
                      type="submit"
                      className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                    >
                      Save
                    </button>
                  </form>
                  <div className="flex items-center gap-2 pl-10 sm:pl-0">
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
              <p className="px-1 py-6 text-center text-sm text-muted-foreground">
                No types yet. Add your first one above.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
