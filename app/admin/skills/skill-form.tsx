import type { Skill } from "@/db/schema";
import { saveSkill } from "../actions";
import { SubmitButton } from "../_components/submit-button";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary/50";

const CATEGORIES = ["Languages", "Frontend", "Backend", "Databases", "Tools"];

export function SkillForm({ skill }: { skill?: Skill }) {
  return (
    <form
      action={saveSkill}
      className="flex flex-col gap-3 sm:flex-row sm:items-end"
    >
      {skill && <input type="hidden" name="id" value={skill.id} />}
      <div className="flex-1 space-y-1.5">
        <label htmlFor="name" className="text-sm font-medium text-foreground">
          Skill
        </label>
        <input
          id="name"
          name="name"
          required
          defaultValue={skill?.name}
          placeholder="TypeScript"
          className={inputClass}
        />
      </div>
      <div className="space-y-1.5">
        <label
          htmlFor="category"
          className="text-sm font-medium text-foreground"
        >
          Category
        </label>
        <select
          id="category"
          name="category"
          defaultValue={skill?.category ?? "Languages"}
          className={inputClass}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1.5">
        <label
          htmlFor="sortOrder"
          className="text-sm font-medium text-foreground"
        >
          Order
        </label>
        <input
          id="sortOrder"
          name="sortOrder"
          type="number"
          defaultValue={skill?.sortOrder ?? 0}
          className={`${inputClass} sm:w-20`}
        />
      </div>
      <SubmitButton label={skill ? "Update" : "Add"} />
    </form>
  );
}
