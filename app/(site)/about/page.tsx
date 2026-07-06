import type { Metadata } from "next";
import Image from "next/image";
import { MapPin, Mail, Phone, FileDown } from "lucide-react";
import { ExperienceSection } from "@/components/sections/experience";
import { EducationSection } from "@/components/sections/education";
import { SkillsSection } from "@/components/sections/skills";
import { Reveal } from "@/components/ui/reveal";
import { Separator } from "@/components/ui/separator";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import {
  getProfile,
  getExperiences,
  getEducation,
  getSkillCategories,
} from "@/db/queries";

export const metadata: Metadata = {
  title: "About",
};

export default async function AboutPage() {
  const [profile, work, teaching, education, skills] = await Promise.all([
    getProfile(),
    getExperiences("work"),
    getExperiences("teaching"),
    getEducation(),
    getSkillCategories(),
  ]);

  if (!profile) return null;

  return (
    <>
      <section className="py-20 md:py-28">
        <Reveal>
          {profile.avatarUrl && (
            <Image
              src={profile.avatarUrl}
              alt={profile.name}
              width={128}
              height={128}
              priority
              className="mb-6 size-32 rounded-full border border-border object-cover"
            />
          )}
          <p className="text-sm font-medium tracking-[0.15em] text-primary mb-3">
            ABOUT
          </p>
          <h1 className="text-4xl md:text-5xl font-light text-foreground leading-tight mb-6">
            {profile.name}
          </h1>
        </Reveal>
        <Reveal delay={100}>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line max-w-2xl">
            {profile.about || profile.summary}
          </p>
        </Reveal>
        <Reveal delay={200}>
          <div className="mt-8 flex flex-col gap-2 text-sm text-muted-foreground">
            {profile.location && (
              <span className="inline-flex items-center gap-2">
                <MapPin className="size-4" /> {profile.location}
              </span>
            )}
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <Mail className="size-4" /> {profile.email}
              </a>
            )}
            {profile.phone && (
              <span className="inline-flex items-center gap-2">
                <Phone className="size-4" /> {profile.phone}
              </span>
            )}
          </div>
          {profile.resumeUrl && (
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "outline" }), "mt-6")}
            >
              <FileDown className="size-4 mr-2" />
              Download Resume
            </a>
          )}
        </Reveal>
      </section>
      <Separator />
      <ExperienceSection experiences={work} />
      {teaching.length > 0 && (
        <>
          <Separator />
          <ExperienceSection
            experiences={teaching}
            title="Teaching"
            id="teaching"
          />
        </>
      )}
      <Separator />
      <EducationSection education={education} />
      <Separator />
      <SkillsSection skillCategories={skills} />
    </>
  );
}
