ALTER TABLE "profile" DROP COLUMN IF EXISTS "resume_url";
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "resume_config" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"summary" text DEFAULT '' NOT NULL,
	"sections" jsonb DEFAULT '[{"key":"summary","visible":true},{"key":"education","visible":true},{"key":"experience","visible":true},{"key":"skills","visible":true},{"key":"projects","visible":true}]'::jsonb NOT NULL,
	"header_fields" jsonb DEFAULT '{"phone":true,"email":true,"website":true,"github":true,"linkedin":true,"location":true}'::jsonb NOT NULL,
	"experience_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"education_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"skill_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"project_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "resume_config_singleton_check" CHECK ("id" = 1)
);
