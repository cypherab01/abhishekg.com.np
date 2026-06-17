import { education } from "@/constants/data";
import { Section } from "@/components/layout/section";
import { Timeline, TimelineItem } from "@/components/ui/timeline";

export function EducationSection() {
  return (
    <Section id="education" title="Education">
      <Timeline>
        {education.map((edu, i) => (
          <TimelineItem
            key={edu.institution}
            title={edu.degree}
            subtitle={edu.institution}
            date={`${edu.startDate} – ${edu.endDate}`}
            isLast={i === education.length - 1}
          />
        ))}
      </Timeline>
    </Section>
  );
}
