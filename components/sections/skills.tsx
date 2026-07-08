import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/ui/reveal";

interface SkillCategory {
  id?: number;
  label: string;
  items: Array<{ id?: number; name: string }>;
}

export function SkillsSection({
  skillCategories,
}: {
  skillCategories: SkillCategory[];
}) {
  if (skillCategories.length === 0) return null;

  return (
    <Section id="skills" title="Skills & Tools">
      <div className="space-y-6">
        {skillCategories.map((category, i) => (
          <Reveal key={category.id ?? category.label} delay={i * 80}>
            <p className="text-sm font-medium text-foreground mb-2">
              {category.label}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {category.items.map((skill) => (
                <span
                  key={skill.id ?? skill.name}
                  className="text-sm px-3 py-1 rounded-md border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
