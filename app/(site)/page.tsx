import { Hero } from "@/components/sections/hero";
import { ExperienceSection } from "@/components/sections/experience";
import { ProjectsSection } from "@/components/sections/projects";
import { EducationSection } from "@/components/sections/education";
import { SkillsSection } from "@/components/sections/skills";
import { Section, type SectionTone } from "@/components/layout/section";
import { ContactForm } from "@/components/sections/contact-form";
import { BlogSection } from "@/components/sections/blog";
import { getPopularPosts } from "@/lib/blog";
import {
  getProfile,
  getExperienceGroups,
  getFeaturedProjects,
  getActiveProjects,
  getEducation,
  getSkillGroups,
} from "@/db/queries";

export default async function Home() {
  const [profile, experienceGroups, featured, allProjects, education, skills, posts] =
    await Promise.all([
      getProfile(),
      getExperienceGroups(),
      getFeaturedProjects(),
      getActiveProjects(),
      getEducation(),
      getSkillGroups(),
      getPopularPosts(),
    ]);

  if (!profile) return null;

  // Fall back to all projects if none are flagged as featured.
  const projects = featured.length > 0 ? featured : allProjects.slice(0, 3);

  // Work history leads, then projects; supporting groups (certificates,
  // awards, ...) follow skills and education, matching how reviewers scan.
  const [primaryGroup, ...otherGroups] = experienceGroups.filter(
    (group) => group.items.length > 0,
  );

  // Bands alternate tint and surface by position, so the pattern holds no
  // matter how many experience groups exist.
  const tints: SectionTone[] = ["tinted", "tint-1", "tint-2", "tint-3"];
  const toneAt = (position: number): SectionTone =>
    position % 2 === 0 ? tints[(position / 2) % tints.length] : "surface";
  // Experience, projects, skills, education, then the other groups.
  const afterGroups = 4 + otherGroups.length;

  return (
    <>
      <Hero profile={profile} />

      {primaryGroup && (
        <ExperienceSection
          experiences={primaryGroup.items}
          title={primaryGroup.label}
          headline="Where the work happened."
          id="experience"
          tone={toneAt(0)}
        />
      )}

      <ProjectsSection
        projects={projects}
        showAllLink={allProjects.length > projects.length}
        tone={toneAt(1)}
      />

      <SkillsSection skillCategories={skills} tone={toneAt(2)} />

      <EducationSection education={education} tone={toneAt(3)} />

      {otherGroups.map((group, index) => (
        <ExperienceSection
          key={group.kind}
          experiences={group.items}
          title={group.label}
          headline={`More ${group.label.toLowerCase()}.`}
          id={group.kind}
          tone={toneAt(4 + index)}
        />
      ))}

      <BlogSection
        mostViewed={posts.mostViewed}
        mostLiked={posts.mostLiked}
        tone={toneAt(afterGroups)}
      />

      <Section
        id="contact"
        eyebrow="Contact"
        title="Let's work together."
        lead="Tell me what you're building and I'll get back to you."
        tone={toneAt(afterGroups + 1)}
      >
        <ContactForm />
      </Section>
    </>
  );
}
