ALTER TABLE "education" RENAME COLUMN "cgpa" TO "grade_value";
--> statement-breakpoint
ALTER TABLE "education" RENAME COLUMN "cgpa_scale" TO "grade_scale";
--> statement-breakpoint
ALTER TABLE "education" ADD COLUMN IF NOT EXISTS "is_percentage" boolean NOT NULL DEFAULT false;
