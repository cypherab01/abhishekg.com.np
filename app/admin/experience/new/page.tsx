import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ExperienceForm } from "../experience-form";

export default function NewExperiencePage() {
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
        New experience
      </h1>
      <ExperienceForm />
    </div>
  );
}
