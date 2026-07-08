import type { Metadata } from "next";
import { ProjectCard } from "@/components/ui/project-card";
import { Reveal } from "@/components/ui/reveal";
import { getProjects, getProjectCategories } from "@/db/queries";

export const metadata: Metadata = {
  title: "Projects",
};

export default async function ProjectsPage() {
  const [projects, categories] = await Promise.all([
    getProjects(),
    getProjectCategories(),
  ]);
  const categoryNameById = new Map(categories.map((category) => [category.id, category.name]));

  return (
    <section className="py-20 md:py-28">
      <Reveal>
        <p className="text-sm font-medium tracking-[0.15em] text-primary mb-3">
          PROJECTS
        </p>
        <h1 className="text-4xl md:text-5xl font-light text-foreground leading-tight mb-4">
          Things I&apos;ve built
        </h1>
        <p className="text-muted-foreground max-w-lg mb-12">
          A selection of web and mobile applications, platforms, and
          experiments.
        </p>
      </Reveal>
      {projects.length === 0 ? (
        <p className="text-muted-foreground">No projects yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {projects.map((project, i) => (
            <Reveal key={project.id} delay={i * 70} className="h-full">
              <ProjectCard
                title={project.name}
                category={categoryNameById.get(project.categoryId)}
                coverImage={project.coverImage}
                description={project.description.join(" ")}
                skills={project.technologies}
                href={`/projects/${project.slug}`}
              />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
