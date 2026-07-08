CREATE TABLE IF NOT EXISTS "experience_kinds" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "experience_kinds_name_unique" UNIQUE("name")
);
--> statement-breakpoint
INSERT INTO "experience_kinds" ("name", "sort_order")
VALUES ('work', 0), ('teaching', 1)
ON CONFLICT ("name") DO NOTHING;
--> statement-breakpoint
ALTER TABLE "experiences" ADD COLUMN IF NOT EXISTS "kind_id" integer;
--> statement-breakpoint
DO $$
BEGIN
	IF EXISTS (
		SELECT 1
		FROM information_schema.columns
		WHERE table_name = 'experiences'
		  AND column_name = 'kind'
	) THEN
		UPDATE "experiences"
		SET "kind_id" = (
			SELECT "id" FROM "experience_kinds" WHERE "name" = "kind" LIMIT 1
		)
		WHERE "kind_id" IS NULL
		  AND EXISTS (
			SELECT 1 FROM "experience_kinds" WHERE "name" = "kind"
		  );
	END IF;
END $$;
--> statement-breakpoint
UPDATE "experiences" SET "kind_id" = (
	SELECT "id" FROM "experience_kinds" WHERE "name" = 'work' LIMIT 1
)
WHERE "kind_id" IS NULL;
--> statement-breakpoint
ALTER TABLE "experiences"
ALTER COLUMN "kind_id" SET NOT NULL;
--> statement-breakpoint
DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM pg_constraint
		WHERE conname = 'experiences_kind_id_experience_kinds_id_fk'
	) THEN
		ALTER TABLE "experiences"
		ADD CONSTRAINT "experiences_kind_id_experience_kinds_id_fk"
		FOREIGN KEY ("kind_id") REFERENCES "public"."experience_kinds"("id") ON DELETE restrict ON UPDATE no action;
	END IF;
END $$;
--> statement-breakpoint
ALTER TABLE "experiences" DROP COLUMN IF EXISTS "kind";