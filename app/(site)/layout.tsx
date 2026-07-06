import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getProfile } from "@/db/queries";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  if (!profile) return {};
  const title = `${profile.name} — ${profile.role}`;
  return {
    title: { default: title, template: `%s · ${profile.name}` },
    description: profile.summary,
    metadataBase: profile.website ? new URL(profile.website) : undefined,
    openGraph: {
      title,
      description: profile.summary,
      images: profile.avatarUrl ? [profile.avatarUrl] : undefined,
    },
  };
}

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();

  if (!profile) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-3xl flex-col items-center justify-center px-6 text-center">
        <h1 className="text-2xl font-light">No profile found</h1>
        <p className="mt-2 text-muted-foreground">
          Run <code className="font-mono">pnpm db:seed</code> to populate the
          database.
        </p>
      </main>
    );
  }

  return (
    <>
      <Navbar initials={profile.initials} resumeUrl={profile.resumeUrl} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6">{children}</main>
      <Footer profile={profile} />
    </>
  );
}
