ALTER TABLE "projects" ALTER COLUMN "cover_image" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "cover_image" SET DATA TYPE jsonb USING
	CASE
		WHEN "cover_image" IS NULL OR btrim("cover_image") = '' THEN '[]'::jsonb
		ELSE jsonb_build_array("cover_image")
	END;--> statement-breakpoint
UPDATE "projects" SET "cover_image" = '[]'::jsonb WHERE "cover_image" IS NULL;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "cover_image" SET DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "cover_image" SET NOT NULL;
