import { Hero } from "@/components/sections/hero";
import { ExperienceSection } from "@/components/sections/experience";
import { ProjectsSection } from "@/components/sections/projects";
import { EducationSection } from "@/components/sections/education";
import { SkillsSection } from "@/components/sections/skills";
import { Section } from "@/components/layout/section";
import { ContactForm } from "@/components/sections/contact-form";
import { BlogSection } from "@/components/sections/blog";
import { getPopularPosts } from "@/lib/blog";
import {
  getProfile,
  getExperienceGroups,
  getFeaturedProjects,
  getProjects,
  getEducation,
  getSkillGroups,
} from "@/db/queries";

export default async function Home() {
  const [profile, experienceGroups, featured, allProjects, education, skills, posts] =
    await Promise.all([
      getProfile(),
      getExperienceGroups(),
      getFeaturedProjects(),
      getProjects(),
      getEducation(),
      getSkillGroups(),
      getPopularPosts(),
    ]);

  if (!profile) return null;

  // Fall back to all projects if none are flagged as featured.
  const projects = featured.length > 0 ? featured : allProjects.slice(0, 3);

  return (
    <>
      <Hero profile={profile} />

      {/* Bands alternate surface and tint; never two of the same in a row. */}
      {experienceGroups.map((group, index) => (
        <ExperienceSection
          key={group.kind}
          experiences={group.items}
          title={group.label}
          headline={index === 0 ? "Where the work happened." : `More ${group.label.toLowerCase()}.`}
          id={index === 0 ? "experience" : group.kind}
          tone={index % 2 === 0 ? "tinted" : "surface"}
        />
      ))}

      <ProjectsSection
        projects={projects}
        showAllLink={allProjects.length > projects.length}
        tone="tint-1"
      />

      <EducationSection education={education} tone="surface" />

      <SkillsSection skillCategories={skills} tone="tint-2" />

      <BlogSection
        mostViewed={posts.mostViewed}
        mostLiked={posts.mostLiked}
        tone="surface"
      />

      <Section
        id="contact"
        eyebrow="Contact"
        title="Let's work together."
        lead="Tell me what you're building and I'll get back to you."
        tone="tint-3"
      >
        <ContactForm />
      </Section>
    </>
  );
}
