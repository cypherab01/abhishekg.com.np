import "server-only";
import { pdf } from "@react-pdf/renderer";
import { PDFDocument } from "pdf-lib";
import { registerResumeFonts } from "./fonts";
import { buildResumeView } from "./filter";
import ResumeDocument from "./document";
import { RESUME_TIERS } from "./types";
import type { ResumeConfigInput, ResumeData } from "./types";

async function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks);
}

async function countPages(buffer: Buffer): Promise<number> {
  const doc = await PDFDocument.load(buffer);
  return doc.getPageCount();
}

export async function buildResumePdfBuffer(
  config: ResumeConfigInput,
  data: ResumeData,
): Promise<Buffer> {
  registerResumeFonts();
  const view = buildResumeView(config, data);

  let lastBuffer: Buffer | null = null;
  for (const tier of RESUME_TIERS) {
    const stream = await pdf(ResumeDocument({ view, tier })).toBuffer();
    const built = await streamToBuffer(stream);
    lastBuffer = built;

    const pageCount = await countPages(built);
    if (pageCount <= 1) return built;
  }

  return lastBuffer!;
}
