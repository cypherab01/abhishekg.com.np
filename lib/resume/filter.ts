import type { ResumeConfigInput, ResumeData, ResumeView } from "./types";

function labelize(raw: string) {
  return raw
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function buildResumeView(
  config: ResumeConfigInput,
  data: ResumeData,
): ResumeView {
  const experienceIdSet = new Set(config.experienceIds);
  const educationIdSet = new Set(config.educationIds);
  const skillIdSet = new Set(config.skillIds);
  const projectIdSet = new Set(config.projectIds);

  const selectedExperiences = data.experiences.filter((e) =>
    experienceIdSet.has(e.id),
  );
  const experienceGroups = data.experienceKinds
    .map((kind) => ({
      kindLabel: labelize(kind.name),
      sortOrder: kind.sortOrder,
      items: selectedExperiences.filter((e) => e.kindId === kind.id),
    }))
    .filter((group) => group.items.length > 0)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(({ kindLabel, items }) => ({ kindLabel, items }));

  const education = data.education.filter((e) => educationIdSet.has(e.id));

  const selectedSkills = data.skills.filter((s) => skillIdSet.has(s.id));
  const skillGroups = data.skillCategories
    .map((category) => ({
      categoryLabel: category.name,
      sortOrder: category.sortOrder,
      items: selectedSkills.filter((s) => s.categoryId === category.id),
    }))
    .filter((group) => group.items.length > 0)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(({ categoryLabel, items }) => ({ categoryLabel, items }));

  const projects = data.projects.filter((p) => projectIdSet.has(p.id));

  const sectionOrder = config.sections
    .filter((section) => section.visible)
    .map((section) => section.key);

  return {
    profile: data.profile,
    summary: config.summary,
    headerFields: config.headerFields,
    sectionOrder,
    experienceGroups,
    education,
    skillGroups,
    projects,
  };
}
