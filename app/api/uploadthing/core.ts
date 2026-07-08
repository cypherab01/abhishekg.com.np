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
