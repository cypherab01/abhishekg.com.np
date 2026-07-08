import { z } from "zod";
import type {
  Profile,
  Experience,
  ExperienceKind,
  Education,
  SkillCategory,
  Skill,
  Project,
  ResumeSectionKey,
  ResumeHeaderField,
} from "@/db/schema";
import { RESUME_SECTION_KEYS } from "@/db/schema";

export const RESUME_TIERS = ["comfortable", "compact", "dense"] as const;
export type ResumeTier = (typeof RESUME_TIERS)[number];

export type TierStyle = {
  baseFontSize: number;
  headingFontSize: number;
  nameFontSize: number;
  lineHeight: number;
  sectionGap: number;
  itemGap: number;
  bulletGap: number;
};

export const TIER_STYLES: Record<ResumeTier, TierStyle> = {
  comfortable: {
    baseFontSize: 9.6,
    headingFontSize: 11.5,
    nameFontSize: 20,
    lineHeight: 1.35,
    sectionGap: 11,
    itemGap: 7,
    bulletGap: 2.5,
  },
  compact: {
    baseFontSize: 9.2,
    headingFontSize: 11,
    nameFontSize: 19,
    lineHeight: 1.25,
    sectionGap: 9,
    itemGap: 5.5,
    bulletGap: 2,
  },
  dense: {
    baseFontSize: 8.7,
    headingFontSize: 10.5,
    nameFontSize: 18,
    lineHeight: 1.15,
    sectionGap: 7,
    itemGap: 4,
    bulletGap: 1.5,
  },
};

export const resumeConfigInputSchema = z.object({
  summary: z.string(),
  sections: z
    .array(
      z.object({
        key: z.enum(RESUME_SECTION_KEYS),
        visible: z.boolean(),
      }),
    )
    .refine(
      (sections) =>
        sections.length === RESUME_SECTION_KEYS.length &&
        RESUME_SECTION_KEYS.every(
          (key) => sections.filter((s) => s.key === key).length === 1,
        ),
      { message: "sections must contain each section key exactly once" },
    ),
  headerFields: z.object({
    phone: z.boolean(),
    email: z.boolean(),
    website: z.boolean(),
    github: z.boolean(),
    linkedin: z.boolean(),
    location: z.boolean(),
  }),
  experienceIds: z.array(z.number().int()),
  educationIds: z.array(z.number().int()),
  skillIds: z.array(z.number().int()),
  projectIds: z.array(z.number().int()),
  experienceLineIndices: z.record(z.string(), z.array(z.number().int())),
  projectLineIndices: z.record(z.string(), z.array(z.number().int())),
});

export type ResumeConfigInput = z.infer<typeof resumeConfigInputSchema>;

export type ResumeLineIndicesInput = ResumeConfigInput["experienceLineIndices"];

export type ResumeData = {
  profile: Profile;
  experienceKinds: ExperienceKind[];
  experiences: Experience[];
  education: Education[];
  skillCategories: SkillCategory[];
  skills: Skill[];
  projects: Project[];
};

export type ResumeExperienceGroup = {
  kindLabel: string;
  items: Experience[];
};

export type ResumeSkillGroup = {
  categoryLabel: string;
  items: Skill[];
};

export type ResumeView = {
  profile: Profile;
  summary: string;
  headerFields: Record<ResumeHeaderField, boolean>;
  sectionOrder: ResumeSectionKey[];
  experienceGroups: ResumeExperienceGroup[];
  education: Education[];
  skillGroups: ResumeSkillGroup[];
  projects: Project[];
};
