"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { adminNavLinks } from "@/lib/nav";
import { logout } from "./actions";
import { cn } from "@/lib/utils";

export function AdminSidebar({ unread }: { unread: number }) {
  const pathname = usePathname();

  return (
    <aside className="w-full border-b border-border md:h-dvh md:w-56 md:shrink-0 md:border-b-0 md:border-r md:sticky md:top-0">
      <div className="flex h-14 items-center px-6 font-semibold text-foreground">
        <Link href="/admin">Admin Panel</Link>
      </div>
      <nav className="flex flex-wrap gap-1 px-3 pb-3 md:flex-col md:pb-0">
        {adminNavLinks.map((link) => {
          const active =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
              )}
            >
              <span>{link.label}</span>
              {link.label === "Messages" && unread > 0 && (
                <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
                  {unread}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <form action={logout} className="px-3 pb-3 md:absolute md:bottom-3 md:w-56">
        <button
          type="submit"
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
        >
          <LogOut className="size-4" />
          Sign out
        </button>
      </form>
    </aside>
  );
}
