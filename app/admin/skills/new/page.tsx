import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "../../_components/ui";
import { SkillForm } from "../skill-form";

export default function NewSkillPage() {
  return (
    <div>
      <Link
        href="/admin/skills"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to skills
      </Link>

      <PageHeader
        title="Add skill"
        description="Add a skill and assign it to a category."
      />

      <div className="card-elevated rounded-2xl border border-border bg-card p-5">
        <SkillForm />
      </div>
    </div>
  );
}
