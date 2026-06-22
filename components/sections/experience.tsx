import { experiences } from "@/constants/data";
import { Section } from "@/components/layout/section";
import { Timeline, TimelineItem } from "@/components/ui/timeline";
import { Reveal } from "@/components/ui/reveal";

export function ExperienceSection() {
  return (
    <Section id="experience" title="Experience">
      <Timeline>
        {experiences.map((exp, i) => (
          <Reveal key={exp.company} delay={i * 90}>
            <TimelineItem
              title={exp.title}
              subtitle={`${exp.company} · ${exp.location}`}
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
