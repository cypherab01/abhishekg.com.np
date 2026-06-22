import { education } from "@/constants/data";
import { Section } from "@/components/layout/section";
import { Timeline, TimelineItem } from "@/components/ui/timeline";
import { Reveal } from "@/components/ui/reveal";

export function EducationSection() {
  return (
    <Section id="education" title="Education">
      <Timeline>
        {education.map((edu, i) => (
          <Reveal key={edu.institution} delay={i * 90}>
            <TimelineItem
              title={edu.degree}
              subtitle={edu.institution}
              date={`${edu.startDate} – ${edu.endDate}`}
              isLast={i === education.length - 1}
            />
          </Reveal>
        ))}
      </Timeline>
    </Section>
  );
}
