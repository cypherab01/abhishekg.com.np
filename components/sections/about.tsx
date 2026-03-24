import { personalInfo } from "@/lib/data";
import { Section } from "@/components/layout/section";

export function About() {
  return (
    <Section id="about" title="About">
      <p className="text-muted-foreground leading-relaxed max-w-lg">
        {personalInfo.about}
      </p>
    </Section>
  );
}
