import { projects } from "@/app/projects/projects";

const getProject = async (slug: string) => {
  const project = projects.find((project) => project.slug === slug);
  return project;
};

const page = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  const project = await getProject(id);

  console.log(project);
  return (
    <div>
      <h1>{project?.title || "Project not found"}</h1>
      <p>{project?.description || "Description not found"}</p>
      <p>{project?.technologiesUsed.join(", ") || "Technologies not found"}</p>
      <p>
        {project?.myResponsibilities.join(", ") || "Responsibilities not found"}
      </p>
      <p>{project?.links.live || "Live link not found"}</p>
      <p>{project?.links.github || "GitHub link not found"}</p>
    </div>
  );
};
export default page;
