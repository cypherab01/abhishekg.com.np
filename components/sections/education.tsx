import type { Education } from "@/db/schema";
import { Section } from "@/components/layout/section";
import { Timeline, TimelineItem } from "@/components/ui/timeline";
import { Reveal } from "@/components/ui/reveal";

export function EducationSection({
  education,
}: {
  education: Education[];
}) {
  if (education.length === 0) return null;

  return (
    <Section id="education" title="Education">
      <Timeline>
        {education.map((edu, i) => {
          const grade =
            edu.gradeValue != null
              ? edu.isPercentage
                ? `${edu.gradeValue}%`
                : `CGPA ${edu.gradeValue}${edu.gradeScale ? `/${edu.gradeScale}` : ""}`
              : null;
          const meta = [edu.university, grade].filter(Boolean).join(" · ");
          return (
            <Reveal key={edu.id} delay={i * 90}>
              <TimelineItem
                title={edu.degree}
                subtitle={edu.institution}
                date={`${edu.startDate} – ${edu.endDate}`}
                description={
                  [meta, edu.description].filter(Boolean).join(" — ") ||
                  undefined
                }
                isLast={i === education.length - 1}
              />
            </Reveal>
          );
        })}
      </Timeline>
    </Section>
  );
}
