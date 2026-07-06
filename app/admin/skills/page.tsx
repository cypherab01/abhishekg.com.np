import Link from "next/link";
import { Pencil } from "lucide-react";
import { getSkills } from "@/db/queries";
import { deleteSkill } from "../actions";
import { DeleteButton } from "../_components/delete-button";
import { SkillForm } from "./skill-form";

export default async function AdminSkillsPage() {
  const skills = await getSkills();

  const grouped = new Map<string, typeof skills>();
  for (const s of skills) {
    if (!grouped.has(s.category)) grouped.set(s.category, []);
    grouped.get(s.category)!.push(s);
  }

  return (
    <div>
      <h1 className="text-2xl font-light text-foreground">Skills &amp; Tools</h1>
      <p className="mt-1 mb-8 text-sm text-muted-foreground">
        Grouped by category. Order controls display within each category.
      </p>

      <div className="mb-10 rounded-lg border border-border p-4">
        <p className="mb-4 text-sm font-medium text-foreground">Add a skill</p>
        <SkillForm />
      </div>

      <div className="space-y-6">
        {[...grouped.entries()].map(([category, items]) => (
          <div key={category}>
            <p className="mb-2 text-sm font-medium text-primary">{category}</p>
            <div className="flex flex-wrap gap-2">
              {items.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center gap-1 rounded-md border border-border py-1 pl-3 pr-1 text-sm text-foreground"
                >
                  <span>{skill.name}</span>
                  <Link
                    href={`/admin/skills/${skill.id}`}
                    className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                    aria-label="Edit"
                  >
                    <Pencil className="size-3.5" />
                  </Link>
                  <form action={deleteSkill}>
                    <input type="hidden" name="id" value={skill.id} />
                    <DeleteButton compact confirmLabel={`Delete "${skill.name}"?`} />
                  </form>
                </div>
              ))}
            </div>
          </div>
        ))}
        {skills.length === 0 && (
          <p className="text-sm text-muted-foreground">No skills yet.</p>
        )}
      </div>
    </div>
  );
}
