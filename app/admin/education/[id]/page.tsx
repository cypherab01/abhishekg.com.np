import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getEducationById } from "@/db/queries";
import { EducationForm } from "../education-form";

export default async function EditEducationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const education = await getEducationById(Number(id));
  if (!education) notFound();

  return (
    <div>
      <Link
        href="/admin/education"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back
      </Link>
      <h1 className="mb-8 text-2xl font-light text-foreground">
        Edit education
      </h1>
      <EducationForm education={education} />
    </div>
  );
}
