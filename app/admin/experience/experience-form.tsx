import type { Experience } from "@/db/schema";
import { getExperienceKindList } from "@/db/queries";
import { saveExperience } from "../actions";
import { Field, TextArea, Checkbox } from "../_components/fields";
import { SubmitButton } from "../_components/submit-button";

export async function ExperienceForm({
  experience,
}: {
  experience?: Experience;
}) {
  const kinds = await getExperienceKindList();
  const defaultKind =
    kinds.find((kind) => kind.id === experience?.kindId)?.name ??
    kinds[0]?.name ??
    "work";

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
          defaultValue={defaultKind}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary/50"
        >
          {kinds.map((kind) => (
            <option key={kind.id} value={kind.name}>
              {kind.name}
            </option>
          ))}
        </select>
        <p className="text-xs text-muted-foreground">
          Add a new type from the field below the list, or select an existing one.
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
          defaultValue={experience?.sortOrder ?? 0}
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
