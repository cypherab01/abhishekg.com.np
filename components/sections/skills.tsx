import { skillCategories } from "@/constants/data";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/ui/reveal";

export function SkillsSection() {
  return (
    <Section id="skills" title="Skills & Tools">
      <div className="space-y-6">
        {skillCategories.map((category, i) => (
          <Reveal key={category.label} delay={i * 80}>
            <p className="text-sm font-medium text-foreground mb-2">
              {category.label}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {category.items.map((skill) => (
                <span
                  key={skill}
                  className="text-sm px-3 py-1 rounded-md border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
