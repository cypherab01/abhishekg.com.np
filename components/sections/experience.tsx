import type { Experience } from "@/db/schema";
import { Section, type SectionTone } from "@/components/layout/section";
import { Timeline, TimelineItem } from "@/components/ui/timeline";
import { Reveal } from "@/components/ui/reveal";

export function ExperienceSection({
  experiences,
  title = "Experience",
  headline = "Where the work happened.",
  id = "experience",
  tone = "tinted",
}: {
  experiences: Experience[];
  /** Eyebrow — names the section. */
  title?: string;
  /** Headline — sentence case, terminal period. */
  headline?: string;
  id?: string;
  tone?: SectionTone;
}) {
  if (experiences.length === 0) return null;

  return (
    <Section id={id} eyebrow={title} title={headline} tone={tone}>
      <Timeline>
        {experiences.map((exp, i) => (
          <Reveal key={exp.id} delay={i * 60}>
            <TimelineItem
              title={exp.title}
              subtitle={
                exp.company
                  ? `${exp.company}${exp.location ? ` · ${exp.location}` : ""}`
                  : exp.location
              }
              date={`${exp.startDate}${exp.endDate ? ` – ${exp.endDate}` : ""}`}
              description={exp.responsibilities}
              tags={exp.technologies}
              isLast={i === experiences.length - 1}
            />
          </Reveal>
        ))}
      </Timeline>
    </Section>
  );
}
