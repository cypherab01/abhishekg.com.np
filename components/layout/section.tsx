import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";

/**
 * A full-bleed marketing band: the background escapes the container, the
 * content never does. Sections alternate between the plain surface and a
 * tint — never two consecutive bands in the same tint, or the boundary
 * disappears and the page reads as one long block.
 */
export type SectionTone =
  | "surface"
  | "tinted"
  | "tint-1"
  | "tint-2"
  | "tint-3"
  | "inverse";

const toneClass: Record<SectionTone, string> = {
  surface: "bg-background",
  tinted: "bg-surface-tinted",
  "tint-1": "bg-tint-1",
  "tint-2": "bg-tint-2",
  "tint-3": "bg-tint-3",
  inverse: "bg-surface-inverse text-white [&_h2]:text-white",
};

interface SectionProps {
  id?: string;
  /** Names the subject. Sentence case, no period. */
  eyebrow?: string;
  /** States the benefit. Three to six words, sentence case, terminal period. */
  title: string;
  lead?: string;
  tone?: SectionTone;
  /** Text link with chevron, sitting on the headline's baseline. */
  cta?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Section({
  id,
  eyebrow,
  title,
  lead,
  tone = "surface",
  cta,
  children,
  className,
}: SectionProps) {
  const inverse = tone === "inverse";
  // A <section> only registers as a landmark once it has an accessible name.
  const headingId = id ? `${id}-heading` : undefined;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn("gfs-section", toneClass[tone], className)}
    >
      <div className="gfs-container">
        <Reveal>
          <div className="mb-12 flex flex-wrap items-end justify-between gap-x-8 gap-y-4 md:mb-16">
            <div className="max-w-[28ch]">
              {eyebrow && (
                <p
                  className={cn(
                    "mb-3 text-sm font-medium",
                    inverse ? "text-[var(--gfs-grey-400)]" : "text-muted-foreground",
                  )}
                >
                  {eyebrow}
                </p>
              )}
              <h2
                id={headingId}
                className="text-section leading-[1.15] tracking-[-0.015em]"
              >
                {title}
              </h2>
            </div>
            {cta}
          </div>
          {lead && (
            <p
              className={cn(
                "-mt-6 mb-12 max-w-[60ch] text-lead md:mb-16",
                inverse ? "text-[var(--gfs-grey-400)]" : "text-muted-foreground",
              )}
            >
              {lead}
            </p>
          )}
        </Reveal>
        {children}
      </div>
    </section>
  );
}
