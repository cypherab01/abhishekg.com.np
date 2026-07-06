import type { Education } from "@/db/schema";
import { saveEducation } from "../actions";
import { Field, TextArea } from "../_components/fields";
import { SubmitButton } from "../_components/submit-button";

export function EducationForm({ education }: { education?: Education }) {
  return (
    <form action={saveEducation} className="space-y-5">
      {education && <input type="hidden" name="id" value={education.id} />}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field
          label="Degree"
          name="degree"
          defaultValue={education?.degree}
          required
        />
        <Field
          label="Institution"
          name="institution"
          defaultValue={education?.institution}
          required
        />
        <Field
          label="University / Board"
          name="university"
          defaultValue={education?.university}
        />
        <Field
          label="Faculty"
          name="faculty"
          defaultValue={education?.faculty}
        />
        <Field
          label="Location"
          name="location"
          defaultValue={education?.location}
        />
        <Field
          label="Sort order"
          name="sortOrder"
          type="number"
          defaultValue={education?.sortOrder ?? 0}
        />
        <Field
          label="Start date"
          name="startDate"
          defaultValue={education?.startDate}
          placeholder="2021-03"
        />
        <Field
          label="End date"
          name="endDate"
          defaultValue={education?.endDate}
          placeholder="2025-06"
        />
        <Field
          label="CGPA"
          name="cgpa"
          type="number"
          defaultValue={education?.cgpa}
          placeholder="3.51"
        />
        <Field
          label="CGPA scale"
          name="cgpaScale"
          type="number"
          defaultValue={education?.cgpaScale}
          placeholder="4.0"
        />
      </div>

      <TextArea
        label="Description"
        name="description"
        defaultValue={education?.description}
        rows={3}
      />

      <SubmitButton label={education ? "Update" : "Create"} />
    </form>
  );
}
