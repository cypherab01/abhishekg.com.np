import { experiences } from "@/constants/data";
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
            date={`${exp.startDate}${exp.endDate ? ` – ${exp.endDate}` : ""}`}
            description={exp.responsibilities.join(" • ")}
            tags={exp.technologies}
            isLast={i === experiences.length - 1}
          />
        ))}
      </Timeline>
    </Section>
  );
}
