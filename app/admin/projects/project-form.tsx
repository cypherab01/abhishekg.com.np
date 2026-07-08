import type { Project } from "@/db/schema";
import { getProjectCategoryList } from "@/db/queries";
import { saveProject } from "../actions";
import { Field, TextArea, Checkbox } from "../_components/fields";
import { UploadField } from "../_components/upload-field";
import { SubmitButton } from "../_components/submit-button";

export async function ProjectForm({ project }: { project?: Project }) {
  const categories = await getProjectCategoryList();
  const defaultCategoryId = project?.categoryId ?? categories[0]?.id;

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
        <div className="space-y-1.5">
          <label htmlFor="category" className="text-sm font-medium text-foreground">
            Category
          </label>
          <select
            id="category"
            name="category"
            defaultValue={defaultCategoryId}
            className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground shadow-sm outline-none transition-all focus:border-primary/60 focus:ring-4 focus:ring-primary/10"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">
            Choose a project category from the dropdown.
          </p>
        </div>
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
