import { skillCategories } from "@/lib/data";
import { Section } from "@/components/layout/section";

export function SkillsSection() {
  return (
    <Section id="skills" title="Skills & Tools">
      <div className="space-y-6">
        {skillCategories.map((category) => (
          <div key={category.label}>
            <p className="text-sm font-medium text-foreground mb-2">
              {category.label}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {category.items.map((skill) => (
                <span
                  key={skill}
                  className="text-sm px-3 py-1 rounded-md border border-border text-muted-foreground"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
