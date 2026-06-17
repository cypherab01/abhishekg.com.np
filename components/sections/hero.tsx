import { personalInfo } from "@/constants/data";
import { HeroCta } from "./hero-cta";

export function Hero() {
  return (
    <section className="py-24 md:py-32">
      <p className="text-sm font-medium tracking-[0.15em] text-primary mb-3">
        {personalInfo.headline.toUpperCase()}
      </p>
      <h1 className="text-4xl md:text-5xl font-light text-foreground leading-tight mb-4">
        {personalInfo.name}
      </h1>
      <p className="text-muted-foreground max-w-md leading-relaxed mb-8">
        {personalInfo.summary}
      </p>
      <HeroCta />
    </section>
  );
}
