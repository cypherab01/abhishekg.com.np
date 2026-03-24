import { cn } from "@/lib/utils";

interface TimelineItemProps {
  title: string;
  subtitle: string;
  date?: string;
  description?: string;
  tags?: string[];
  isLast?: boolean;
}

export function TimelineItem({
  title,
  subtitle,
  date,
  description,
  tags,
  isLast = false,
}: TimelineItemProps) {
  return (
    <div className={cn("relative pl-8", !isLast && "pb-8")}>
      {/* Line */}
      {!isLast && (
        <div className="absolute left-[4.5px] top-3 bottom-0 w-px bg-border" />
      )}
      {/* Dot */}
      <div className="absolute left-0 top-1.5 size-[10px] rounded-full bg-primary" />

      <div>
        <p className="font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground mt-0.5">
          {subtitle}
          {date && <span> &middot; {date}</span>}
        </p>
        {description && (
          <p className="text-sm text-muted-foreground/80 mt-2 leading-relaxed">
            {description}
          </p>
        )}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground"
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

interface TimelineProps {
  children: React.ReactNode;
}

export function Timeline({ children }: TimelineProps) {
  return <div className="relative">{children}</div>;
}
