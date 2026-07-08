CREATE TABLE IF NOT EXISTS "project_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "project_categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
INSERT INTO "project_categories" ("name", "sort_order")
SELECT DISTINCT "category", ROW_NUMBER() OVER (ORDER BY MIN("sort_order"), "category") - 1
FROM "projects"
GROUP BY "category"
HAVING "category" <> ''
ON CONFLICT ("name") DO NOTHING;
--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "category_id" integer;
--> statement-breakpoint
UPDATE "projects"
SET "category_id" = (
	SELECT "id" FROM "project_categories" WHERE "name" = "category" LIMIT 1
)
WHERE "category_id" IS NULL AND "category" <> '';
--> statement-breakpoint
UPDATE "projects"
SET "category_id" = (
	SELECT "id" FROM "project_categories" WHERE "name" = 'Uncategorized' LIMIT 1
)
WHERE "category_id" IS NULL;
--> statement-breakpoint
INSERT INTO "project_categories" ("name", "sort_order")
VALUES ('Uncategorized', 999)
ON CONFLICT ("name") DO NOTHING;
--> statement-breakpoint
ALTER TABLE "projects"
ALTER COLUMN "category_id" SET NOT NULL;
--> statement-breakpoint
DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM pg_constraint
		WHERE conname = 'projects_category_id_project_categories_id_fk'
	) THEN
		ALTER TABLE "projects"
		ADD CONSTRAINT "projects_category_id_project_categories_id_fk"
		FOREIGN KEY ("category_id") REFERENCES "public"."project_categories"("id") ON DELETE restrict ON UPDATE no action;
	END IF;
END $$;
--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN IF EXISTS "category";