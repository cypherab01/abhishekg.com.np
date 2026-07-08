import { Hero } from "@/components/sections/hero";
import { ExperienceSection } from "@/components/sections/experience";
import { ProjectsSection } from "@/components/sections/projects";
import { EducationSection } from "@/components/sections/education";
import { SkillsSection } from "@/components/sections/skills";
import { Section } from "@/components/layout/section";
import { ContactForm } from "@/components/sections/contact-form";
import { Separator } from "@/components/ui/separator";
import { Fragment } from "react";
import {
  getProfile,
  getExperienceGroups,
  getFeaturedProjects,
  getProjects,
  getEducation,
  getSkillGroups,
} from "@/db/queries";

export default async function Home() {
  const [profile, experienceGroups, featured, allProjects, education, skills] =
    await Promise.all([
      getProfile(),
      getExperienceGroups(),
      getFeaturedProjects(),
      getProjects(),
      getEducation(),
      getSkillGroups(),
    ]);

  if (!profile) return null;

  // Fall back to all projects if none are flagged as featured.
  const projects = featured.length > 0 ? featured : allProjects.slice(0, 4);

  return (
    <>
      <Hero profile={profile} />
      <Separator />
      {experienceGroups.map((group, index) => (
        <Fragment key={group.kind}>
          <ExperienceSection
            experiences={group.items}
            title={group.label}
            id={index === 0 ? "experience" : group.kind}
          />
          {index < experienceGroups.length - 1 && <Separator />}
        </Fragment>
      ))}
      <Separator />
      <ProjectsSection
        projects={projects}
        showAllLink={allProjects.length > projects.length}
      />
      <Separator />
      <EducationSection education={education} />
      <Separator />
      <SkillsSection skillCategories={skills} />
      <Separator />
      <Section id="contact-form" title="Get in Touch">
        <ContactForm />
      </Section>
    </>
  );
}
