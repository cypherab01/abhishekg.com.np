import { experiences } from "@/lib/data";
import { Section } from "@/components/layout/section";
import { Timeline, TimelineItem } from "@/components/ui/timeline";

export function ExperienceSection() {
  return (
    <Section id="experience" title="Experience">
      <Timeline>
        {experiences.map((exp, i) => (
          <TimelineItem
            key={exp.company}
            title={exp.title}
            subtitle={`${exp.company} · ${exp.location}`}
            date={exp.date}
            description={exp.description}
            tags={exp.skills}
            isLast={i === experiences.length - 1}
          />
        ))}
      </Timeline>
    </Section>
  );
}
