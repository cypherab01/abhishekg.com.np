"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/lib/nav";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

interface NavbarProps {
  initials: string;
  name: string;
}

export function Navbar({ initials, name }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // At rest the bar is flat; a hairline appears once the page has moved.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The mobile sheet is full-height; lock the page behind it.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background transition-[border-color] duration-200 ease-standard",
        scrolled ? "border-border" : "border-transparent",
      )}
    >
      <nav
        aria-label="Main"
        className="gfs-container flex h-14 items-center justify-between gap-6 md:h-16"
      >
        <Link
          href="/"
          className="flex items-center gap-2.5 text-base font-medium tracking-[-0.01em] text-foreground"
        >
          <span
            aria-hidden
            className="flex size-8 items-center justify-center rounded-full bg-accent text-sm font-medium text-accent-foreground"
          >
            {initials}
          </span>
          <span className="hidden sm:inline">{name}</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors duration-200 ease-standard hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/#contact-form"
              className={cn(buttonVariants({ variant: "default" }))}
            >
              Get in touch
            </Link>
          </div>
        </div>

        {/* Mobile controls — the primary CTA stays visible in the bar. */}
        <div className="flex items-center gap-1 md:hidden">
          <Link
            href="/#contact-form"
            className={cn(buttonVariants({ variant: "default", size: "sm" }))}
          >
            Get in touch
          </Link>
          <Button
            variant="ghost"
            size="icon"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-foreground"
          >
            {mobileOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </nav>

      {/* Mobile sheet */}
      <div
        id="mobile-nav"
        hidden={!mobileOpen}
        className="fixed inset-x-0 bottom-0 top-14 z-50 overflow-y-auto bg-background md:hidden"
      >
        <div className="gfs-container flex flex-col py-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="border-b border-outline-variant py-4 text-lg text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-6">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
