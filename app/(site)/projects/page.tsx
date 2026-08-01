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
  const categoryNameById = new Map(
    categories.map((category) => [category.id, category.name]),
  );

  return (
    <>
      <section className="gfs-hero bg-background">
        <div className="gfs-container">
          <Reveal>
            <p className="mb-4 text-sm font-medium text-muted-foreground">
              Projects
            </p>
            <h1 className="max-w-[20ch] text-hero leading-[1.08] tracking-[-0.02em]">
              Things I&apos;ve built.
            </h1>
            <p className="mt-6 max-w-[60ch] text-lead text-muted-foreground">
              Web and mobile applications, platforms, and the odd experiment.
            </p>
          </Reveal>
        </div>
      </section>

      <section aria-label="All projects" className="gfs-section bg-surface-tinted">
        <div className="gfs-container">
          {projects.length === 0 ? (
            <p className="text-muted-foreground">
              Nothing here yet. New work lands as it ships.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, i) => (
                <Reveal key={project.id} delay={i * 50} className="h-full">
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
        </div>
      </section>
    </>
  );
}
