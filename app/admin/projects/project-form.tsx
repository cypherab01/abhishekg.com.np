import type { Project } from "@/db/schema";
import { saveProject } from "../actions";
import { Field, TextArea, Checkbox } from "../_components/fields";
import { UploadField } from "../_components/upload-field";
import { SubmitButton } from "../_components/submit-button";

export function ProjectForm({ project }: { project?: Project }) {
  return (
    <form action={saveProject} className="space-y-5">
      {project && <input type="hidden" name="id" value={project.id} />}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Name" name="name" defaultValue={project?.name} required />
        <Field
          label="Slug"
          name="slug"
          defaultValue={project?.slug}
          hint="Leave blank to auto-generate from name."
        />
        <Field
          label="Category"
          name="category"
          defaultValue={project?.category}
          placeholder="Full Stack Application"
        />
        <Field
          label="Status"
          name="status"
          defaultValue={project?.status}
          placeholder="Active"
        />
        <Field
          label="Website URL"
          name="website"
          defaultValue={project?.website}
        />
        <Field
          label="Play Store URL"
          name="playStore"
          defaultValue={project?.playStore}
        />
        <Field
          label="GitHub URL"
          name="github"
          defaultValue={project?.github}
        />
        <Field
          label="Sort order"
          name="sortOrder"
          type="number"
          defaultValue={project?.sortOrder ?? 0}
        />
      </div>

      <Field
        label="Technologies"
        name="technologies"
        defaultValue={project?.technologies.join(", ")}
        hint="Comma-separated."
      />
      <TextArea
        label="Description"
        name="description"
        defaultValue={project?.description.join("\n")}
        rows={6}
        hint="One bullet point per line."
      />

      <UploadField
        label="Cover image"
        name="coverImage"
        endpoint="imageUploader"
        defaultUrl={project?.coverImage}
        kind="image"
      />

      <Checkbox
        label="Feature on home page"
        name="featured"
        defaultChecked={project?.featured}
      />

      <SubmitButton label={project ? "Update" : "Create"} />
    </form>
  );
}
