import Image from "next/image";
import type { Profile } from "@/db/schema";
import { HeroCta } from "./hero-cta";

export function Hero({ profile }: { profile: Profile }) {
  return (
    <section className="gfs-hero bg-background">
      <div className="gfs-container flex flex-col items-center text-center">
        {profile.avatarUrl && (
          <div className="animate-fade-up mb-8" style={{ animationDelay: "0ms" }}>
            <Image
              src={profile.avatarUrl}
              alt={`Portrait of ${profile.name}.`}
              width={112}
              height={112}
              priority
              className="size-28 rounded-full object-cover"
            />
          </div>
        )}
        {/* Eyebrow names the subject; the headline states who they are. */}
        <p
          className="animate-fade-up mb-4 text-sm font-medium text-muted-foreground"
          style={{ animationDelay: "50ms" }}
        >
          {profile.headline}
        </p>
        <h1
          className="animate-fade-up max-w-[20ch] text-hero leading-[1.08] tracking-[-0.02em]"
          style={{ animationDelay: "100ms" }}
        >
          {profile.name}
        </h1>
        <p
          className="animate-fade-up mt-6 max-w-[60ch] text-lead text-muted-foreground"
          style={{ animationDelay: "150ms" }}
        >
          {profile.summary}
        </p>
        <div
          className="animate-fade-up mt-8 md:mt-10"
          style={{ animationDelay: "200ms" }}
        >
          <HeroCta github={profile.github} email={profile.email} />
        </div>
      </div>
    </section>
  );
}
