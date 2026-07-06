import type { Experience } from "@/db/schema";
import { Section } from "@/components/layout/section";
import { Timeline, TimelineItem } from "@/components/ui/timeline";
import { Reveal } from "@/components/ui/reveal";

export function ExperienceSection({
  experiences,
  title = "Experience",
  id = "experience",
}: {
  experiences: Experience[];
  title?: string;
  id?: string;
}) {
  if (experiences.length === 0) return null;

  return (
    <Section id={id} title={title}>
      <Timeline>
        {experiences.map((exp, i) => (
          <Reveal key={exp.id} delay={i * 90}>
            <TimelineItem
              title={exp.title}
              subtitle={
                exp.company
                  ? `${exp.company}${exp.location ? ` · ${exp.location}` : ""}`
                  : exp.location
              }
              date={`${exp.startDate}${exp.endDate ? ` – ${exp.endDate}` : ""}`}
              description={exp.responsibilities.join(" • ")}
              tags={exp.technologies}
              isLast={i === experiences.length - 1}
            />
          </Reveal>
        ))}
      </Timeline>
    </Section>
  );
}
