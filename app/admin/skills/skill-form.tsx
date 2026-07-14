import type { Skill, SkillCategory } from "@/db/schema";
import { getSkillCategoryList, getSkills } from "@/db/queries";
import { saveSkill } from "../actions";
import { SubmitButton } from "../_components/submit-button";
import { inputClass } from "../_components/ui";

export async function SkillForm({
  skill,
  categories: categoriesProp,
}: {
  skill?: Skill;
  categories?: SkillCategory[];
}) {
  const categories = categoriesProp ?? (await getSkillCategoryList());

  if (categories.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Create a skill category first, then add skills here.
      </p>
    );
  }

  const defaultSortOrder = skill
    ? skill.sortOrder
    : (await getSkills()).length + 1;

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
          name="categoryId"
          defaultValue={String(skill?.categoryId ?? categories[0]?.id)}
          className={inputClass}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
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
          defaultValue={defaultSortOrder}
          className={`${inputClass} sm:w-20`}
        />
      </div>
      <SubmitButton label={skill ? "Update" : "Add"} />
    </form>
  );
}
