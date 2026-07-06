import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getExperienceById } from "@/db/queries";
import { ExperienceForm } from "../experience-form";

export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const experience = await getExperienceById(Number(id));
  if (!experience) notFound();

  return (
    <div>
      <Link
        href="/admin/experience"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back
      </Link>
      <h1 className="mb-8 text-2xl font-light text-foreground">
        Edit experience
      </h1>
      <ExperienceForm experience={experience} />
    </div>
  );
}
