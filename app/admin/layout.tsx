import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { isAuthenticated } from "@/lib/auth";
import { getUnreadMessageCount, getProfile } from "@/db/queries";
import { AdminSidebar } from "./admin-sidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authed = await isAuthenticated();

  // Unauthenticated users only ever see the login page (middleware enforces).
  if (!authed) {
    return <div className="admin-scope min-h-dvh bg-background">{children}</div>;
  }

  const [unread, profile] = await Promise.all([
    getUnreadMessageCount(),
    getProfile(),
  ]);

  return (
    <div className="admin-scope flex min-h-dvh flex-col bg-background md:flex-row">
      <AdminSidebar
        unread={unread}
        profile={{
          name: profile?.name ?? null,
          role: profile?.role ?? null,
          initials: profile?.initials ?? null,
          avatarUrl: profile?.avatarUrl ?? null,
        }}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/80 px-6 backdrop-blur-md">
          <p className="text-sm text-muted-foreground">
            Welcome back
            {profile?.name ? (
              <span className="font-medium text-foreground">
                , {profile.name.split(" ")[0]}
              </span>
            ) : null}{" "}
            👋
          </p>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground hover:border-primary/30"
            >
              View site
              <ExternalLink className="size-3.5" />
            </Link>
            <ThemeToggle />
          </div>
        </header>
        <main className="w-full flex-1 px-6 py-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
