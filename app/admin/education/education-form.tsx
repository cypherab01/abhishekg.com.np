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
        <div className="space-y-1.5">
          <label
            htmlFor="gradingSystem"
            className="text-sm font-medium text-foreground"
          >
            Grading system
          </label>
          <select
            id="gradingSystem"
            name="gradingSystem"
            defaultValue={education?.isPercentage ? "percentage" : "gpa"}
            className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground shadow-sm outline-none transition-all focus:border-primary/60 focus:ring-4 focus:ring-primary/10"
          >
            <option value="gpa">GPA</option>
            <option value="percentage">Percentage</option>
          </select>
        </div>
        <Field
          label="Score"
          name="gradeValue"
          type="number"
          defaultValue={education?.gradeValue}
          placeholder="3.51 or 85"
        />
        <Field
          label="Scale"
          name="gradeScale"
          type="number"
          defaultValue={education?.gradeScale}
          placeholder="4.0"
          hint="Only used for GPA."
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
