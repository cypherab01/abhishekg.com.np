import { Mail } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import { personalInfo } from "@/lib/data";

export function Footer() {
  return (
    <footer id="contact" className="border-t border-border py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-6">
        <p className="text-xs font-medium tracking-[0.2em] text-primary mb-6">
          CONTACT
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="font-medium text-foreground text-lg">
              Let&apos;s work together
            </p>
            <a
              href={`mailto:${personalInfo.email}`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {personalInfo.email}
            </a>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <GithubIcon className="size-4" />
              GitHub
            </a>
            <a
              href={`mailto:${personalInfo.email}`}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Mail className="size-4" />
              Email
            </a>
          </div>
        </div>
        <p className="text-xs text-muted-foreground/60 mt-12">
          &copy; {new Date().getFullYear()} {personalInfo.name}
        </p>
      </div>
    </footer>
  );
}
