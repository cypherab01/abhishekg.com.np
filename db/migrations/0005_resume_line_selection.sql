ALTER TABLE "resume_config" ADD COLUMN IF NOT EXISTS "experience_line_indices" jsonb DEFAULT '{}'::jsonb NOT NULL;
--> statement-breakpoint
ALTER TABLE "resume_config" ADD COLUMN IF NOT EXISTS "project_line_indices" jsonb DEFAULT '{}'::jsonb NOT NULL;
