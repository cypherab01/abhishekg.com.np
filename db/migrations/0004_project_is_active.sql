-- Projects already on the site stay live; only new ones start hidden.
ALTER TABLE "projects" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "is_active" SET DEFAULT false;
