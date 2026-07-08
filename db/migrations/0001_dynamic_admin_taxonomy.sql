UPDATE "profile"
SET "id" = 1
WHERE "id" = (
  SELECT "id"
  FROM "profile"
  ORDER BY "id"
  LIMIT 1
);
--> statement-breakpoint
DELETE FROM "profile"
WHERE "id" <> 1;
--> statement-breakpoint
ALTER TABLE "profile"
ALTER COLUMN "id" SET DEFAULT 1;
--> statement-breakpoint
ALTER TABLE "profile"
ADD CONSTRAINT "profile_singleton_check" CHECK ("id" = 1);
--> statement-breakpoint
CREATE TABLE "skill_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "skill_categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "skills" ADD COLUMN "category_id" integer;
--> statement-breakpoint
INSERT INTO "skill_categories" ("name", "sort_order")
SELECT "category", MIN("sort_order") AS "sort_order"
FROM "skills"
GROUP BY "category"
ORDER BY MIN("sort_order"), "category";
--> statement-breakpoint
UPDATE "skills" AS s
SET "category_id" = c."id"
FROM "skill_categories" AS c
WHERE s."category" = c."name";
--> statement-breakpoint
ALTER TABLE "skills"
ALTER COLUMN "category_id" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "skills"
ADD CONSTRAINT "skills_category_id_skill_categories_id_fk"
FOREIGN KEY ("category_id") REFERENCES "public"."skill_categories"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "skills" DROP COLUMN "category";