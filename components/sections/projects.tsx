import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Project } from "@/db/schema";
import { Section, type SectionTone } from "@/components/layout/section";
import { ProjectCard } from "@/components/ui/project-card";
import { Reveal } from "@/components/ui/reveal";
import { getProjectCategories } from "@/db/queries";

export function ProjectsSection({
  projects,
  title = "Projects",
  headline = "Things I've built.",
  showAllLink = false,
  tone = "tint-1",
}: {
  projects: Project[];
  title?: string;
  headline?: string;
  showAllLink?: boolean;
  tone?: SectionTone;
}) {
  if (projects.length === 0) return null;

  const categoryNameByIdPromise = getProjectCategories().then(
    (categories) => new Map(categories.map((c) => [c.id, c.name])),
  );

  return (
    <ProjectsSectionContent
      projects={projects}
      title={title}
      headline={headline}
      showAllLink={showAllLink}
      tone={tone}
      categoryNameByIdPromise={categoryNameByIdPromise}
    />
  );
}

async function ProjectsSectionContent({
  projects,
  title,
  headline,
  showAllLink,
  tone,
  categoryNameByIdPromise,
}: {
  projects: Project[];
  title: string;
  headline: string;
  showAllLink: boolean;
  tone: SectionTone;
  categoryNameByIdPromise: Promise<Map<number, string>>;
}) {
  const categoryNameById = await categoryNameByIdPromise;

  return (
    <Section
      id="projects"
      eyebrow={title}
      title={headline}
      tone={tone}
      cta={
        showAllLink ? (
          <Link href="/projects" className="link-cta">
            Browse all projects
            <ChevronRight className="size-5" aria-hidden />
          </Link>
        ) : undefined
      }
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => (
          <Reveal key={project.id} delay={i * 60} className="h-full">
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
    </Section>
  );
}
