import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  title: string;
  description: string;
  skills: string[];
  category?: string;
  href?: string;
  className?: string;
}

/**
 * Elevated marketing card: flat at rest, faint shadow on hover. Text only —
 * screenshots live on the detail page, so listings stay a calm typographic
 * grid. Content order is fixed — eyebrow, title, body, CTA. The whole card is
 * one link, so the "Learn more" affordance is decorative.
 */
export function ProjectCard({
  title,
  description,
  skills,
  category,
  href,
  className,
}: ProjectCardProps) {
  const MAX_SKILLS = 4;
  const visibleSkills = skills.slice(0, MAX_SKILLS);
  const hiddenCount = skills.length - visibleSkills.length;

  const inner = (
    <div
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-3xl bg-background p-6 transition-shadow duration-200 ease-standard hover:shadow-elev-2 sm:p-8",
        className,
      )}
    >
      <div className="flex flex-1 flex-col">
        {category && (
          <p className="mb-2 text-sm font-medium text-muted-foreground">
            {category}
          </p>
        )}
        <h3 className="text-card-title font-medium leading-[1.3] tracking-[-0.005em]">
          {title}
        </h3>
        <p className="mt-3 line-clamp-2 text-muted-foreground">{description}</p>

        {visibleSkills.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {visibleSkills.map((skill, i) => (
              <span
                key={`${skill}-${i}`}
                className="rounded-full border border-border px-3 py-1 text-sm text-muted-foreground"
              >
                {skill}
              </span>
            ))}
            {hiddenCount > 0 && (
              <span className="rounded-full border border-border px-3 py-1 text-sm text-muted-foreground">
                +{hiddenCount}
              </span>
            )}
          </div>
        )}

        {href && (
          <span
            className="mt-auto inline-flex items-center gap-1 pt-6 font-medium text-link"
            aria-hidden
          >
            Learn more
            <ChevronRight className="size-5 transition-transform duration-200 ease-standard group-hover:translate-x-[3px] motion-reduce:transform-none" />
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      // No aria-label: the card's own heading and copy name the link, and an
      // override would break voice control ("click Learn more").
      <Link href={href} className="block h-full rounded-3xl">
        {inner}
      </Link>
    );
  }
  return inner;
}
