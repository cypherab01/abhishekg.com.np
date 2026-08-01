"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LogOut,
  LayoutDashboard,
  User,
  Briefcase,
  FolderGit2,
  GraduationCap,
  Wrench,
  MessageSquare,
  FileText,
  type LucideIcon,
} from "lucide-react";
import { adminNavLinks, type AdminNavIcon } from "@/lib/nav";
import { logout } from "./actions";
import { cn } from "@/lib/utils";

const icons: Record<AdminNavIcon, LucideIcon> = {
  dashboard: LayoutDashboard,
  profile: User,
  experience: Briefcase,
  projects: FolderGit2,
  education: GraduationCap,
  skills: Wrench,
  resume: FileText,
  messages: MessageSquare,
};

type SidebarProfile = {
  name: string | null;
  role: string | null;
  initials: string | null;
  avatarUrl: string | null;
};

/**
 * Material 3 navigation drawer: 56px full-pill destinations, the active one
 * filled with the accent container rather than the accent itself. Tonal
 * surfaces carry the hierarchy — no shadows anywhere in here.
 */
export function AdminSidebar({
  unread,
  profile,
}: {
  unread: number;
  profile: SidebarProfile;
}) {
  const pathname = usePathname();

  return (
    <aside className="flex w-full flex-col bg-surface-tinted md:sticky md:top-0 md:h-dvh md:w-72 md:shrink-0">
      {/* Brand */}
      <div className="flex h-16 items-center gap-3 px-6">
        <span className="flex size-9 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <LayoutDashboard className="size-5" aria-hidden />
        </span>
        <Link href="/admin" className="flex flex-col leading-tight">
          <span className="text-sm font-medium text-foreground">
            Content manager
          </span>
          <span className="text-xs text-muted-foreground">
            {profile.name ?? "Portfolio"}
          </span>
        </Link>
      </div>

      {/* Destinations */}
      <nav
        aria-label="Admin sections"
        className="flex flex-1 flex-wrap gap-1 px-3 pb-3 md:flex-col md:flex-nowrap md:overflow-y-auto md:pb-0"
      >
        {adminNavLinks.map((link) => {
          const Icon = icons[link.icon];
          const active =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "state-layer flex h-14 items-center gap-3 rounded-full px-5 text-sm font-medium transition-colors duration-200 ease-standard",
                active
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-5 shrink-0" aria-hidden />
              <span className="flex-1">{link.label}</span>
              {link.label === "Messages" && unread > 0 && (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-medium text-primary-foreground">
                  {unread}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Account */}
      <div className="mt-auto p-3">
        <div className="flex items-center gap-3 px-3 py-2">
          {profile.avatarUrl ? (
            <Image
              src={profile.avatarUrl}
              alt=""
              width={40}
              height={40}
              className="size-10 shrink-0 rounded-full object-cover"
            />
          ) : (
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-medium text-accent-foreground">
              {profile.initials || profile.name?.[0] || "A"}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {profile.name || "Administrator"}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {profile.role || "Site owner"}
            </p>
          </div>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="state-layer flex h-12 w-full items-center gap-3 rounded-full px-5 text-sm font-medium text-muted-foreground transition-colors duration-200 ease-standard hover:text-destructive"
          >
            <LogOut className="size-5" aria-hidden />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
