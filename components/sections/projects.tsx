import Link from "next/link";
import type { Project } from "@/db/schema";
import { Section } from "@/components/layout/section";
import { ProjectCard } from "@/components/ui/project-card";
import { Reveal } from "@/components/ui/reveal";
import { getProjectCategories } from "@/db/queries";

export function ProjectsSection({
  projects,
  title = "Projects",
  showAllLink = false,
}: {
  projects: Project[];
  title?: string;
  showAllLink?: boolean;
}) {
  if (projects.length === 0) return null;

  const categoryNameByIdPromise = getProjectCategories().then((categories) =>
    new Map(categories.map((category) => [category.id, category.name])),
  );

  return <ProjectsSectionContent projects={projects} title={title} showAllLink={showAllLink} categoryNameByIdPromise={categoryNameByIdPromise} />;
}

async function ProjectsSectionContent({
  projects,
  title,
  showAllLink,
  categoryNameByIdPromise,
}: {
  projects: Project[];
  title: string;
  showAllLink: boolean;
  categoryNameByIdPromise: Promise<Map<number, string>>;
}) {
  const categoryNameById = await categoryNameByIdPromise;

  return (
    <Section id="projects" title={title}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {projects.map((project, i) => (
          <Reveal key={project.id} delay={i * 80} className="h-full">
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
      {showAllLink && (
        <div className="mt-6">
          <Link
            href="/projects"
            className="text-sm text-primary hover:underline underline-offset-4"
          >
            View all projects →
          </Link>
        </div>
      )}
    </Section>
  );
}
