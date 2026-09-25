import { inputClass } from "../_components/ui";
import type { Project } from "@/db/schema";
import { getProjectCategoryList, getProjects } from "@/db/queries";
import { saveProject } from "../actions";
import { Field, TextArea, Checkbox } from "../_components/fields";
import { MultiUploadField } from "../_components/upload-field";
import { SubmitButton } from "../_components/submit-button";

export async function ProjectForm({ project }: { project?: Project }) {
  const categories = await getProjectCategoryList();
  // The options carry category *names* (that is what the action looks up), so
  // the default has to be a name too — seeding it with the id matched nothing
  // and the browser silently fell back to the first option on every edit.
  const defaultCategory =
    categories.find((c) => c.id === project?.categoryId)?.name ??
    categories[0]?.name;
  const defaultSortOrder = project
    ? project.sortOrder
    : (await getProjects()).length + 1;

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
            defaultValue={defaultCategory}
            className={inputClass}
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
          defaultValue={defaultSortOrder}
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

      <MultiUploadField
        label="Images"
        name="images"
        endpoint="imageUploader"
        defaultUrls={project?.images}
        hint="First image is the cover. Reorder with the arrows; images show on the project detail page, not the cards."
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
