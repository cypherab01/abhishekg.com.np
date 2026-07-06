import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getSkillById } from "@/db/queries";
import { SkillForm } from "../skill-form";

export default async function EditSkillPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const skill = await getSkillById(Number(id));
  if (!skill) notFound();

  return (
    <div>
      <Link
        href="/admin/skills"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back
      </Link>
      <h1 className="mb-8 text-2xl font-light text-foreground">Edit skill</h1>
      <SkillForm skill={skill} />
    </div>
  );
}
