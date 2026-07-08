import "server-only";
import {
  getProfile,
  getAllExperiences,
  getExperienceKindList,
  getEducation,
  getSkills,
  getSkillCategoryList,
  getProjects,
} from "@/db/queries";
import type { ResumeData } from "./types";

export async function getResumeData(): Promise<ResumeData> {
  const [
    profile,
    experienceKinds,
    experiences,
    education,
    skillCategories,
    skills,
    projects,
  ] = await Promise.all([
    getProfile(),
    getExperienceKindList(),
    getAllExperiences(),
    getEducation(),
    getSkillCategoryList(),
    getSkills(),
    getProjects(),
  ]);

  if (!profile) {
    throw new Error("Profile must exist before building a resume");
  }

  return {
    profile,
    experienceKinds,
    experiences,
    education,
    skillCategories,
    skills,
    projects,
  };
}
