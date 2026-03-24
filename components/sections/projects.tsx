import { projects } from "@/lib/data";
import { Section } from "@/components/layout/section";
import { ProjectCard } from "@/components/ui/project-card";

export function ProjectsSection() {
  return (
    <Section id="projects" title="Projects">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {projects.map((project) => (
          <ProjectCard
            key={project.title}
            title={project.title}
            description={project.description}
            skills={project.skills}
          />
        ))}
      </div>
    </Section>
  );
}
