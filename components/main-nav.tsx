"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";

export function MainNav() {
  const pathname = usePathname();

  return (
    <div className="hidden mr-4 md:flex">
      <Link href="/" className="flex items-center gap-2 mr-4 lg:mr-6">
        <Icons.logo className="w-6 h-6" />
        <span className="hidden font-bold lg:inline-block">
          {siteConfig.name}
        </span>
      </Link>
      <nav className="flex items-center gap-4 text-sm xl:gap-6">
        <Link
          href="/"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/docs/installation"
              ? "text-foreground"
              : "text-foreground/80"
          )}
        >
          Home
        </Link>

        <Link
          href="/blog"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/blog")
              ? "text-foreground"
              : "text-foreground/80"
          )}
        >
          Blog
        </Link>
      </nav>
    </div>
  );
}
