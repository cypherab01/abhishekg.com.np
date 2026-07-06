import type { Metadata } from "next";
import Link from "next/link";
import { isAuthenticated } from "@/lib/auth";
import { getUnreadMessageCount } from "@/db/queries";
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
    return <>{children}</>;
  }

  const unread = await getUnreadMessageCount();

  return (
    <div className="flex min-h-dvh flex-col md:flex-row">
      <AdminSidebar unread={unread} />
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-md md:justify-end">
          <Link
            href="/"
            target="_blank"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors md:mr-4"
          >
            View site ↗
          </Link>
          <ThemeToggle />
        </header>
        <main className="mx-auto w-full max-w-3xl px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
