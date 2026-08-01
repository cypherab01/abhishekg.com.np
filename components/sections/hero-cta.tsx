import { ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

interface HeroCtaProps {
  github?: string | null;
  email: string;
}

/**
 * Two pills at most: one filled primary, one outlined secondary. Anything
 * further down the hierarchy becomes a text link with a chevron.
 */
export function HeroCta({ github, email }: HeroCtaProps) {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <a
          href={`mailto:${email}`}
          className={cn(buttonVariants({ variant: "default", size: "lg" }))}
        >
          Get in touch
        </a>
        <a
          href="/api/resume"
          download
          className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
        >
          Download resume
        </a>
      </div>
      {github && (
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          className="link-cta text-sm"
        >
          See the code on GitHub
          <ChevronRight className="size-5" aria-hidden />
        </a>
      )}
    </div>
  );
}
