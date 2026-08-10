import { cn } from "@/lib/utils";

interface TimelineItemProps {
  title: string;
  subtitle: string;
  date?: string;
  /** A string renders as a paragraph; an array renders as a bulleted list. */
  description?: string | string[];
  tags?: string[];
  isLast?: boolean;
}

/**
 * An editorial two-column row rather than a dotted rail: the date sits in a
 * grey left column, the content in the right, separated by hairlines. Borders
 * and whitespace do the structural work — no shadows, no chrome.
 */
export function TimelineItem({
  title,
  subtitle,
  date,
  description,
  tags,
  isLast = false,
}: TimelineItemProps) {
  return (
    <div
      className={cn(
        "grid gap-x-10 gap-y-3 py-8 md:grid-cols-[200px_1fr]",
        !isLast && "border-b border-outline-variant",
      )}
    >
      {date && (
        <p className="text-sm text-muted-foreground md:pt-1">{date}</p>
      )}
      <div className={cn(!date && "md:col-start-2")}>
        <h3 className="text-card-title font-medium leading-[1.3] tracking-[-0.005em]">
          {title}
        </h3>
        <p className="mt-1 text-muted-foreground">{subtitle}</p>
        {Array.isArray(description) ? (
          description.length > 0 && (
            <ul className="mt-4 max-w-[60ch] space-y-2 text-muted-foreground">
              {description.map((line) => (
                <li key={line} className="relative pl-5 leading-relaxed">
                  <span
                    aria-hidden
                    className="absolute left-0 top-[0.65em] size-1.5 rounded-full bg-current opacity-40"
                  />
                  {line}
                </li>
              ))}
            </ul>
          )
        ) : (
          description && (
            <p className="mt-4 max-w-[60ch] text-muted-foreground">
              {description}
            </p>
          )
        )}
        {tags && tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-surface-sunken px-3 py-1 text-sm text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function Timeline({ children }: { children: React.ReactNode }) {
  return <div className="border-t border-outline-variant">{children}</div>;
}
