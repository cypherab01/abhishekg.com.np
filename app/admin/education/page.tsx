import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { getEducation } from "@/db/queries";
import { deleteEducation } from "../actions";
import { DeleteButton } from "../_components/delete-button";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

export default async function AdminEducationPage() {
  const items = await getEducation();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-light text-foreground">Education</h1>
        <Link
          href="/admin/education/new"
          className={cn(buttonVariants({ variant: "default" }))}
        >
          <Plus className="size-4 mr-1.5" />
          Add
        </Link>
      </div>
      <p className="mt-1 mb-8 text-sm text-muted-foreground">
        Academic background.
      </p>

      <div className="space-y-2">
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground">No entries yet.</p>
        )}
        {items.map((edu) => (
          <div
            key={edu.id}
            className="flex items-center justify-between gap-3 rounded-lg border border-border p-4"
          >
            <div className="min-w-0">
              <p className="truncate font-medium text-foreground">
                {edu.degree}
              </p>
              <p className="truncate text-sm text-muted-foreground">
                {[edu.institution, `${edu.startDate} – ${edu.endDate}`]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <Link
                href={`/admin/education/${edu.id}`}
                className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Edit"
              >
                <Pencil className="size-4" />
              </Link>
              <form action={deleteEducation}>
                <input type="hidden" name="id" value={edu.id} />
                <DeleteButton compact confirmLabel={`Delete "${edu.degree}"?`} />
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
