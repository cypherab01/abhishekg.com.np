import type { Metadata } from "next";
import Image from "next/image";
import { MapPin, Mail, Phone } from "lucide-react";
import { ExperienceSection } from "@/components/sections/experience";
import { EducationSection } from "@/components/sections/education";
import { SkillsSection } from "@/components/sections/skills";
import { Reveal } from "@/components/ui/reveal";
import {
  getProfile,
  getExperienceGroups,
  getEducation,
  getSkillGroups,
} from "@/db/queries";

export const metadata: Metadata = {
  title: "About",
};

export default async function AboutPage() {
  const [profile, experienceGroups, education, skills] = await Promise.all([
    getProfile(),
    getExperienceGroups(),
    getEducation(),
    getSkillGroups(),
  ]);

  if (!profile) return null;

  const details = [
    profile.location && { Icon: MapPin, text: profile.location },
    profile.email && {
      Icon: Mail,
      text: profile.email,
      href: `mailto:${profile.email}`,
    },
    profile.phone && { Icon: Phone, text: profile.phone },
  ].filter(Boolean) as {
    Icon: React.ComponentType<{ className?: string }>;
    text: string;
    href?: string;
  }[];

  return (
    <>
      {/* Editorial two-up: portrait on one side, the story on the other. */}
      <section className="gfs-hero bg-background">
        <div className="gfs-container grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <Reveal>
            <p className="mb-4 text-sm font-medium text-muted-foreground">
              About
            </p>
            <h1 className="text-hero leading-[1.08] tracking-[-0.02em]">
              {profile.name}
            </h1>
            <p className="mt-6 max-w-[60ch] whitespace-pre-line text-lead text-muted-foreground">
              {profile.about || profile.summary}
            </p>
            <div className="mt-8 flex flex-col gap-3 text-muted-foreground">
              {details.map(({ Icon, text, href }) => (
                <span key={text} className="inline-flex items-center gap-3">
                  <Icon className="size-5 shrink-0" aria-hidden />
                  {href ? (
                    <a
                      href={href}
                      className="transition-colors duration-200 ease-standard hover:text-foreground"
                    >
                      {text}
                    </a>
                  ) : (
                    text
                  )}
                </span>
              ))}
            </div>
          </Reveal>

          {profile.avatarUrl && (
            <Reveal delay={80}>
              <div className="relative aspect-4/5 w-full overflow-hidden rounded-3xl bg-surface-sunken">
                <Image
                  src={profile.avatarUrl}
                  alt={`Portrait of ${profile.name}.`}
                  fill
                  sizes="(max-width: 768px) 100vw, 560px"
                  priority
                  className="object-cover"
                />
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {experienceGroups.map((group, index) => (
        <ExperienceSection
          key={group.kind}
          experiences={group.items}
          title={group.label}
          headline={
            index === 0
              ? "Where the work happened."
              : `More ${group.label.toLowerCase()}.`
          }
          id={index === 0 ? "experience" : group.kind}
          tone={index % 2 === 0 ? "tinted" : "surface"}
        />
      ))}

      <EducationSection education={education} tone="tint-3" />
      <SkillsSection skillCategories={skills} tone="surface" />
    </>
  );
}
