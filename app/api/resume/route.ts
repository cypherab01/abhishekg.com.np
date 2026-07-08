import { ensureProfile, ensureResumeConfig } from "@/db/queries";
import { getResumeData } from "@/lib/resume/data";
import { buildResumePdfBuffer } from "@/lib/resume/build";
import type { ResumeConfigInput } from "@/lib/resume/types";

export const runtime = "nodejs";

export async function GET() {
  await ensureProfile();
  const config = await ensureResumeConfig();
  if (!config) {
    return new Response("Resume is not configured yet", { status: 404 });
  }

  const data = await getResumeData();
  const input: ResumeConfigInput = {
    summary: config.summary,
    sections: config.sections,
    headerFields: config.headerFields,
    experienceIds: config.experienceIds,
    educationIds: config.educationIds,
    skillIds: config.skillIds,
    projectIds: config.projectIds,
  };

  const buffer = await buildResumePdfBuffer(input, data);
  const fileName = `${data.profile.name.replace(/\s+/g, "-")}-Resume.pdf`;

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "no-store",
    },
  });
}
