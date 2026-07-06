import { Hero } from "@/components/sections/hero";
import { ExperienceSection } from "@/components/sections/experience";
import { ProjectsSection } from "@/components/sections/projects";
import { EducationSection } from "@/components/sections/education";
import { SkillsSection } from "@/components/sections/skills";
import { Section } from "@/components/layout/section";
import { ContactForm } from "@/components/sections/contact-form";
import { Separator } from "@/components/ui/separator";
import {
  getProfile,
  getExperiences,
  getFeaturedProjects,
  getProjects,
  getEducation,
  getSkillCategories,
} from "@/db/queries";

export default async function Home() {
  const [profile, experiences, featured, allProjects, education, skills] =
    await Promise.all([
      getProfile(),
      getExperiences("work"),
      getFeaturedProjects(),
      getProjects(),
      getEducation(),
      getSkillCategories(),
    ]);

  if (!profile) return null;

  // Fall back to all projects if none are flagged as featured.
  const projects = featured.length > 0 ? featured : allProjects.slice(0, 4);

  return (
    <>
      <Hero profile={profile} />
      <Separator />
      <ExperienceSection experiences={experiences} />
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
