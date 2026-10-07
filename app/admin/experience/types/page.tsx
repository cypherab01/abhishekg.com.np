import Link from "next/link";
import { ArrowLeft, AlertTriangle, Plus } from "lucide-react";
import { getExperienceKindList, getExperienceGroups } from "@/db/queries";
import { saveExperienceKind } from "../../actions";
import { FlashToast } from "../../_components/flash-toast";
import { PageHeader, Alert, inputClass } from "../../_components/ui";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { TypesList } from "./types-list";

export default async function ExperienceTypesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const [{ error, saved }, kinds, groups] = await Promise.all([
    searchParams,
    getExperienceKindList(),
    getExperienceGroups(),
  ]);

  // A plain object, not a Map: it crosses into a client component.
  const countByKindId: Record<number, number> = Object.fromEntries(
    groups.map((group) => [group.id, group.items.length]),
  );

  return (
    <div>
      {saved && <FlashToast message="Experience type saved" />}
      <Link
        href="/admin/experience"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to experience
      </Link>

      <PageHeader
        title="Experience types"
        description="The categories in the experience form's dropdown. Drag to set their order on the homepage. A type with entries in it can't be deleted until those entries are moved or removed."
      />

      {error && (
        <Alert tone="error" icon={<AlertTriangle className="size-4" />}>
          {error}
        </Alert>
      )}

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
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
              required
              placeholder="volunteering"
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
          <TypesList kinds={kinds} countByKindId={countByKindId} />
          {kinds.length === 0 && (
            <p className="px-1 py-6 text-center text-sm text-muted-foreground">
              No types yet. Add your first one above.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
