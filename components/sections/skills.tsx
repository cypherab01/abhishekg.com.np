import { Section, type SectionTone } from "@/components/layout/section";
import { Reveal } from "@/components/ui/reveal";

interface SkillCategory {
  id?: number;
  label: string;
  items: Array<{ id?: number; name: string }>;
}

export function SkillsSection({
  skillCategories,
  tone = "tint-2",
}: {
  skillCategories: SkillCategory[];
  tone?: SectionTone;
}) {
  if (skillCategories.length === 0) return null;

  return (
    <Section
      id="skills"
      eyebrow="Skills and tools"
      title="The everyday toolkit."
      tone={tone}
    >
      <div className="grid gap-10 md:grid-cols-2 md:gap-x-16 md:gap-y-12">
        {skillCategories.map((category, i) => (
          <Reveal key={category.id ?? category.label} delay={i * 60}>
            <h3 className="mb-4 text-base font-medium">{category.label}</h3>
            {/* Chips: 32px pill, hairline border, tinted on hover. */}
            <div className="flex flex-wrap gap-2">
              {category.items.map((skill) => (
                <span
                  key={skill.id ?? skill.name}
                  className="inline-flex h-8 items-center rounded-full border border-border px-4 text-sm font-medium text-muted-foreground transition-colors duration-200 ease-standard hover:bg-surface-sunken hover:text-foreground"
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
