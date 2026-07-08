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

export function AdminSidebar({
  unread,
  profile,
}: {
  unread: number;
  profile: SidebarProfile;
}) {
  const pathname = usePathname();

  return (
    <aside className="flex w-full flex-col border-b border-sidebar-border bg-sidebar md:h-dvh md:w-64 md:shrink-0 md:border-b-0 md:border-r md:sticky md:top-0">
      {/* Brand */}
      <div className="flex h-16 items-center gap-2.5 px-5">
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <LayoutDashboard className="size-4.5" />
        </span>
        <Link href="/admin" className="flex flex-col leading-tight">
          <span className="text-sm font-semibold text-sidebar-foreground">
            Admin Panel
          </span>
          <span className="text-[11px] text-muted-foreground">
            Content manager
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav
        aria-label="Admin sections"
        className="flex flex-1 flex-wrap gap-1 px-3 pb-3 md:flex-col md:flex-nowrap md:pb-0"
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
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon
                className={cn(
                  "size-4.5 shrink-0 transition-colors",
                  active
                    ? "text-primary-foreground"
                    : "text-muted-foreground group-hover:text-sidebar-accent-foreground",
                )}
              />
              <span className="flex-1">{link.label}</span>
              {link.label === "Messages" && unread > 0 && (
                <span
                  className={cn(
                    "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold",
                    active
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-primary text-primary-foreground",
                  )}
                >
                  {unread}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User + sign out */}
      <div className="mt-auto space-y-2 border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-xl px-2 py-1.5">
          {profile.avatarUrl ? (
            <Image
              src={profile.avatarUrl}
              alt={profile.name ?? "Avatar"}
              width={36}
              height={36}
              className="size-9 shrink-0 rounded-full object-cover"
            />
          ) : (
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
              {profile.initials || profile.name?.[0] || "A"}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-sidebar-foreground">
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
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
