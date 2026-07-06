import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { isAuthenticated } from "@/lib/auth";

const f = createUploadthing();

const requireAdmin = async () => {
  if (!(await isAuthenticated())) {
    throw new UploadThingError("Unauthorized");
  }
  return { role: "admin" as const };
};

export const ourFileRouter = {
  // Resume PDF (and common doc types)
  resumeUploader: f({
    pdf: { maxFileSize: "16MB", maxFileCount: 1 },
  })
    .middleware(requireAdmin)
    .onUploadComplete(async ({ file }) => {
      return { url: file.ufsUrl };
    }),

  // Images: project covers + avatar
  imageUploader: f({
    image: { maxFileSize: "8MB", maxFileCount: 1 },
  })
    .middleware(requireAdmin)
    .onUploadComplete(async ({ file }) => {
      return { url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
