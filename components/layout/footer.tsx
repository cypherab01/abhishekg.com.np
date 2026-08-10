import Link from "next/link";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";
import type { Profile } from "@/db/schema";

/**
 * Fat footer: link columns grouped by intent, a hairline, then a bottom bar.
 * The density is part of the trust signal this design language trades on.
 */
export function Footer({ profile }: { profile: Profile }) {
  const columns: Array<{
    heading: string;
    links: Array<{ label: string; href: string; external?: boolean }>;
  }> = [
    {
      heading: "Explore",
      links: [
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
        { label: "Projects", href: "/projects" },
      ],
    },
    {
      heading: "Background",
      links: [
        { label: "Experience", href: "/#experience" },
        { label: "Education", href: "/#education" },
        { label: "Skills", href: "/#skills" },
      ],
    },
    {
      heading: "Connect",
      links: [
        ...(profile.github
          ? [{ label: "GitHub", href: profile.github, external: true }]
          : []),
        ...(profile.linkedin
          ? [{ label: "LinkedIn", href: profile.linkedin, external: true }]
          : []),
        { label: "Email", href: `mailto:${profile.email}` },
      ],
    },
    {
      heading: "Resources",
      links: [
        { label: "Download resume", href: "/api/resume" },
        { label: "Get in touch", href: "/#contact" },
        ...(profile.website
          ? [{ label: "Website", href: profile.website, external: true }]
          : []),
      ],
    },
  ];

  const social = [
    profile.github && {
      label: `${profile.name} on GitHub`,
      href: profile.github,
      Icon: GithubIcon,
    },
    profile.linkedin && {
      label: `${profile.name} on LinkedIn`,
      href: profile.linkedin,
      Icon: LinkedinIcon,
    },
    { label: `Email ${profile.name}`, href: `mailto:${profile.email}`, Icon: Mail },
  ].filter(Boolean) as {
    label: string;
    href: string;
    Icon: React.ComponentType<{ className?: string }>;
  }[];

  return (
    <footer id="footer" className="bg-surface-sunken">
      <div className="gfs-container py-16 md:py-20">
        {/* Follow us */}
        <div className="flex flex-wrap items-center gap-4">
          <p className="text-sm font-medium">Find me elsewhere</p>
          <div className="flex items-center gap-2">
            {social.map(({ label, href, Icon }) => (
              <a
                key={href}
                href={href}
                aria-label={label}
                target={href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="state-layer flex size-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors duration-200 ease-standard hover:text-foreground"
              >
                <Icon className="size-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4">
          {columns.map((column) => (
            <div key={column.heading}>
              <h2 className="text-sm font-medium">{column.heading}</h2>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={`${column.heading}-${link.href}`}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground transition-colors duration-200 ease-standard hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors duration-200 ease-standard hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <hr className="mt-12 border-t border-border" />

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium">{profile.name}</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <a
              href={`mailto:${profile.email}`}
              className="transition-colors duration-200 ease-standard hover:text-foreground"
            >
              {profile.email}
            </a>
            {profile.location && <span>{profile.location}</span>}
            <span>&copy; {new Date().getFullYear()}</span>
          </div>
        </div>

        {/* Footnotes */}
        {/* Footnotes stay at #5f6368: the register's usual #80868b is 3.68:1
            on white and fails AA at 12px. */}
        <p className="mt-8 max-w-[80ch] text-xs leading-relaxed text-muted-foreground">
          Availability for new work varies by month and project scope. Response
          times are typical, not guaranteed. All other trademarks are the
          property of their respective owners.
        </p>
      </div>
    </footer>
  );
}
