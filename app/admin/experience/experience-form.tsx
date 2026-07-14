import type { Experience } from "@/db/schema";
import { getExperienceKindList, getAllExperiences } from "@/db/queries";
import { saveExperience } from "../actions";
import { Field, TextArea, Checkbox } from "../_components/fields";
import { SubmitButton } from "../_components/submit-button";

export async function ExperienceForm({
  experience,
}: {
  experience?: Experience;
}) {
  const kinds = await getExperienceKindList();

  if (kinds.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Create an experience type first, then add experience here.
      </p>
    );
  }

  const defaultKindId = experience?.kindId ?? kinds[0].id;
  const defaultSortOrder = experience
    ? experience.sortOrder
    : (await getAllExperiences()).length + 1;

  return (
    <form action={saveExperience} className="space-y-5">
      {experience && <input type="hidden" name="id" value={experience.id} />}

      <div className="space-y-1.5">
        <label htmlFor="kind" className="text-sm font-medium text-foreground">
          Type
        </label>
        <select
          id="kind"
          name="kind"
          defaultValue={defaultKindId}
          className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground shadow-sm outline-none transition-all focus:border-primary/60 focus:ring-4 focus:ring-primary/10"
        >
          {kinds.map((kind) => (
            <option key={kind.id} value={kind.id}>
              {kind.name}
            </option>
          ))}
        </select>
        <p className="text-xs text-muted-foreground">
          Manage available types from the &quot;Manage types&quot; page.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field
          label="Title"
          name="title"
          defaultValue={experience?.title}
          required
        />
        <Field
          label="Company"
          name="company"
          defaultValue={experience?.company}
        />
        <Field
          label="Location"
          name="location"
          defaultValue={experience?.location}
        />
        <Field
          label="Sort order"
          name="sortOrder"
          type="number"
          defaultValue={defaultSortOrder}
        />
        <Field
          label="Start date"
          name="startDate"
          defaultValue={experience?.startDate}
          placeholder="Jan 2024"
        />
        <Field
          label="End date"
          name="endDate"
          defaultValue={experience?.endDate}
          placeholder="Present"
        />
      </div>

      <TextArea
        label="Responsibilities"
        name="responsibilities"
        defaultValue={experience?.responsibilities.join("\n")}
        rows={5}
        hint="One bullet point per line."
      />
      <Field
        label="Technologies"
        name="technologies"
        defaultValue={experience?.technologies.join(", ")}
        hint="Comma-separated (e.g. Next.js, FastAPI)."
      />
      <Checkbox
        label="Currently working here"
        name="current"
        defaultChecked={experience?.current}
      />

      <SubmitButton label={experience ? "Update" : "Create"} />
    </form>
  );
}
