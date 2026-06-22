import { projects } from "@/constants/data";
import { Section } from "@/components/layout/section";
import { ProjectCard } from "@/components/ui/project-card";
import { Reveal } from "@/components/ui/reveal";

export function ProjectsSection() {
  return (
    <Section id="projects" title="Projects">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {projects.map((project, i) => (
          <Reveal key={project.name} delay={i * 80} className="h-full">
            <ProjectCard
              title={project.name}
              description={project.description.join(" ")}
              skills={project.technologies}
            />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
