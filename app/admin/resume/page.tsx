import { CheckCircle2 } from "lucide-react";
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
      {sp.saved && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="size-4" />
          Resume settings saved.
        </div>
      )}
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
