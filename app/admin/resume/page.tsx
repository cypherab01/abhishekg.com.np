import {
  ensureProfile,
  ensureResumeConfig,
  getExperienceGroups,
  getEducation,
  getSkillGroups,
  getProjects,
} from "@/db/queries";
import { PageHeader } from "../_components/ui";
import { ResumeBuilder } from "./resume-builder";
import { FlashToast } from "../_components/flash-toast";

export default async function AdminResumePage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const [profile, config, experienceGroups, education, skillGroups, projects, sp] =
    await Promise.all([
      ensureProfile(),
      ensureResumeConfig(),
      getExperienceGroups(),
      getEducation(),
      getSkillGroups(),
      getProjects(),
      searchParams,
    ]);

  if (!profile || !config) return <p>Unable to load resume settings.</p>;

  return (
    <div>
      <PageHeader
        title="Resume"
        description="Choose what appears on the downloadable resume PDF."
      />
      {sp.saved && <FlashToast message="Resume settings saved" />}
      <ResumeBuilder
        config={config}
        experienceGroups={experienceGroups}
        education={education}
        skillGroups={skillGroups}
        projects={projects}
      />
    </div>
  );
}
