import { personalInfo } from "@/constants/data";
import { HeroCta } from "./hero-cta";

export function Hero() {
  return (
    <section className="py-24 md:py-32">
      <p
        className="animate-fade-up text-sm font-medium tracking-[0.15em] text-primary mb-3"
        style={{ animationDelay: "0ms" }}
      >
        {personalInfo.headline.toUpperCase()}
      </p>
      <h1
        className="animate-fade-up text-4xl md:text-5xl font-light text-foreground leading-tight mb-4"
        style={{ animationDelay: "100ms" }}
      >
        {personalInfo.name}
      </h1>
      <p
        className="animate-fade-up text-muted-foreground max-w-md leading-relaxed mb-8"
        style={{ animationDelay: "200ms" }}
      >
        {personalInfo.summary}
      </p>
      <div className="animate-fade-up" style={{ animationDelay: "300ms" }}>
        <HeroCta />
      </div>
    </section>
  );
}
