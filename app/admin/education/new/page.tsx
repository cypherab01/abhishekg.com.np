import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EducationForm } from "../education-form";

export default function NewEducationPage() {
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
        New education
      </h1>
      <EducationForm />
    </div>
  );
}
