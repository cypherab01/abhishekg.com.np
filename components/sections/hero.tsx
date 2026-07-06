import Image from "next/image";
import type { Profile } from "@/db/schema";
import { HeroCta } from "./hero-cta";

export function Hero({ profile }: { profile: Profile }) {
  return (
    <section className="py-24 md:py-32">
      {profile.avatarUrl && (
        <div className="animate-fade-up mb-6" style={{ animationDelay: "0ms" }}>
          <Image
            src={profile.avatarUrl}
            alt={profile.name}
            width={112}
            height={112}
            priority
            className="size-28 rounded-full border border-border object-cover"
          />
        </div>
      )}
      <p
        className="animate-fade-up text-sm font-medium tracking-[0.15em] text-primary mb-3"
        style={{ animationDelay: "100ms" }}
      >
        {profile.headline.toUpperCase()}
      </p>
      <h1
        className="animate-fade-up text-4xl md:text-5xl font-light text-foreground leading-tight mb-4"
        style={{ animationDelay: "200ms" }}
      >
        {profile.name}
      </h1>
      <p
        className="animate-fade-up text-muted-foreground max-w-md leading-relaxed mb-8"
        style={{ animationDelay: "300ms" }}
      >
        {profile.summary}
      </p>
      <div className="animate-fade-up" style={{ animationDelay: "400ms" }}>
        <HeroCta
          github={profile.github}
          email={profile.email}
          resumeUrl={profile.resumeUrl}
        />
      </div>
    </section>
  );
}
