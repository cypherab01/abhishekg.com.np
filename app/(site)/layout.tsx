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
      <main className="gfs-container flex min-h-dvh flex-col items-center justify-center text-center">
        <h1 className="text-band tracking-[-0.01em]">No profile found.</h1>
        <p className="mt-4 text-muted-foreground">
          Run <code className="font-mono">pnpm db:seed</code> to populate the
          database.
        </p>
      </main>
    );
  }

  return (
    <>
      {/* First focusable element in the document. */}
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <Navbar initials={profile.initials} name={profile.name} />
      <main id="main" className="w-full flex-1">
        {children}
      </main>
      <Footer profile={profile} />
    </>
  );
}
