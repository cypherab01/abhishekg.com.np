import Link from "next/link";
import { Plus } from "lucide-react";
import { getEducation } from "@/db/queries";
import { PageHeader } from "../_components/ui";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { EducationList } from "./education-list";
import { FlashToast } from "../_components/flash-toast";

export default async function AdminEducationPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const [items, sp] = await Promise.all([getEducation(), searchParams]);

  return (
    <div>
      {sp.saved && <FlashToast message="Education saved" />}
      <PageHeader
        title="Education"
        description="Academic background."
        action={
          <Link
            href="/admin/education/new"
            className={cn(buttonVariants({ variant: "default" }))}
          >
            <Plus className="size-4 mr-1.5" />
            Add
          </Link>
        }
      />

      <EducationList items={items} />
    </div>
  );
}
