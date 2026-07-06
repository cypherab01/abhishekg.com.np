import { CheckCircle2 } from "lucide-react";
import { getProfile } from "@/db/queries";
import { updateProfile } from "../actions";
import { Field, TextArea } from "../_components/fields";
import { UploadField } from "../_components/upload-field";
import { SubmitButton } from "../_components/submit-button";

export default async function AdminProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const [profile, sp] = await Promise.all([getProfile(), searchParams]);
  if (!profile) return <p>No profile row found. Run the seed script.</p>;

  return (
    <div>
      <h1 className="text-2xl font-light text-foreground">Profile</h1>
      <p className="mt-1 mb-8 text-sm text-muted-foreground">
        Your personal information, resume, and social links.
      </p>

      {sp.saved && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm text-foreground">
          <CheckCircle2 className="size-4 text-primary" />
          Profile saved.
        </div>
      )}

      <form action={updateProfile} className="space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Name" name="name" defaultValue={profile.name} required />
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
        </div>

        <TextArea
          label="Summary"
          name="summary"
          defaultValue={profile.summary}
          rows={3}
          hint="Short intro shown in the hero section."
        />
        <TextArea
          label="About"
          name="about"
          defaultValue={profile.about}
          rows={6}
          hint="Longer bio shown on the About page. Line breaks are preserved."
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <UploadField
            label="Avatar"
            name="avatarUrl"
            endpoint="imageUploader"
            defaultUrl={profile.avatarUrl}
            kind="image"
            hint="Optional profile image."
          />
          <UploadField
            label="Resume (PDF)"
            name="resumeUrl"
            endpoint="resumeUploader"
            defaultUrl={profile.resumeUrl}
            kind="file"
            hint="Linked from the Download Resume buttons."
          />
        </div>

        <SubmitButton label="Save profile" />
      </form>
    </div>
  );
}
