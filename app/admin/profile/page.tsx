import { CheckCircle2 } from "lucide-react";
import { ensureProfile } from "@/db/queries";
import { updateProfile } from "../actions";
import { Field, TextArea } from "../_components/fields";
import { UploadField } from "../_components/upload-field";
import { SubmitButton } from "../_components/submit-button";
import { PageHeader } from "../_components/ui";

export default async function AdminProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const [profile, sp] = await Promise.all([ensureProfile(), searchParams]);
  if (!profile) return <p>Unable to load profile.</p>;

  return (
    <div>
      <PageHeader
        title="Profile"
        description="Your personal information, resume, and social links."
      />

      {sp.saved && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="size-4" />
          Profile saved.
        </div>
      )}

      <form action={updateProfile} className="space-y-5">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.9fr)] lg:items-stretch">
          <div className="space-y-5">
            <Field
              label="Name"
              name="name"
              defaultValue={profile.name}
              required
            />
            <Field
              label="Initials"
              name="initials"
              defaultValue={profile.initials}
              required
            />
            <Field label="Role" name="role" defaultValue={profile.role} />
            <Field
              label="Headline"
              name="headline"
              defaultValue={profile.headline}
            />
            <TextArea
              label="Summary"
              name="summary"
              defaultValue={profile.summary}
              rows={5}
              hint="Short intro shown in the hero section."
            />
            <TextArea
              label="About"
              name="about"
              defaultValue={profile.about}
              rows={10}
              hint="Longer bio shown on the About page. Line breaks are preserved."
            />
          </div>

          <div className="card-elevated h-full space-y-5 rounded-2xl border border-border bg-card p-4 sm:p-5">
            <p className="text-sm font-medium text-foreground">Quick details</p>
            <div className="grid grid-cols-1 gap-5">
              <Field
                label="Location"
                name="location"
                defaultValue={profile.location}
              />
              <Field label="Phone" name="phone" defaultValue={profile.phone} />
              <Field
                label="Email"
                name="email"
                type="email"
                defaultValue={profile.email}
                required
              />
              <Field
                label="Website"
                name="website"
                defaultValue={profile.website}
              />
              <Field label="GitHub" name="github" defaultValue={profile.github} />
              <Field
                label="LinkedIn"
                name="linkedin"
                defaultValue={profile.linkedin}
              />
              <UploadField
                label="Avatar"
                name="avatarUrl"
                endpoint="imageUploader"
                defaultUrl={profile.avatarUrl}
                kind="image"
                hint="Drop a square image or click to browse."
              />
            </div>
          </div>
        </div>

        <SubmitButton label="Save profile" />
      </form>
    </div>
  );
}
