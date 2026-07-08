import { isAuthenticated } from "@/lib/auth";
import { resumeConfigInputSchema } from "@/lib/resume/types";
import { getResumeData } from "@/lib/resume/data";
import { buildResumePdfBuffer } from "@/lib/resume/build";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await request.json();
  const parsed = resumeConfigInputSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify(parsed.error.flatten()), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const data = await getResumeData();
  const buffer = await buildResumePdfBuffer(parsed.data, data);

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline",
      "Cache-Control": "no-store",
    },
  });
}
