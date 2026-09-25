import { cn } from "@/lib/utils";

/**
 * Material 3 outlined text field: 8px radius, hairline outline, and a focus
 * state made of border + inset shadow so the field never shifts by a pixel.
 */
export const inputClass =
  "w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-[border-color,box-shadow] duration-150 ease-standard placeholder:text-subtle-foreground hover:border-foreground focus:border-primary focus:shadow-[inset_0_0_0_1px_var(--gfs-accent)]";

/**
 * Compact inline-edit input for list rows — borderless at rest, revealing an
 * outline on hover and focus.
 */
export const rowInputClass =
  "w-full min-w-0 rounded-lg border border-transparent bg-transparent px-3 py-1.5 text-sm font-medium text-foreground outline-none transition-[border-color,box-shadow] duration-150 ease-standard placeholder:text-subtle-foreground hover:border-border focus:border-primary focus:shadow-[inset_0_0_0_1px_var(--gfs-accent)]";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        {/* M3 headline-small: 24px, weight 400. */}
        <h1 className="text-2xl leading-8">{title}</h1>
        {action}
      </div>
      {description && (
        <p className="mt-2 max-w-[60ch] text-sm text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}

/**
 * Tonal surface card. In M3 a "higher" surface is lighter, not shadowed —
 * elevation comes from the surface-container ramp, so there is no resting
 * shadow here.
 */
export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "surface-container rounded-2xl border border-outline-variant",
        className,
      )}
    >
      {children}
    </div>
  );
}

type AlertTone = "error" | "success" | "info";

const alertTones: Record<AlertTone, string> = {
  error: "bg-danger-container text-on-danger-container",
  success: "bg-success-container text-on-success-container",
  info: "bg-accent text-accent-foreground",
};

export function Alert({
  tone = "info",
  icon,
  children,
}: {
  tone?: AlertTone;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "mb-6 flex items-start gap-3 rounded-xl p-4 text-sm",
        alertTones[tone],
      )}
    >
      {icon && <span className="mt-0.5 shrink-0">{icon}</span>}
      <span>{children}</span>
    </div>
  );
}

type PillTone = "neutral" | "success" | "danger" | "accent";

const pillTones: Record<PillTone, string> = {
  neutral: "bg-surface-sunken text-muted-foreground",
  success: "bg-success-container text-on-success-container",
  danger: "bg-danger-container text-on-danger-container",
  accent: "bg-accent text-accent-foreground",
};

/** Suggestion chip: pill, 24px, label-medium. */
export function Pill({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: PillTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-xs font-medium",
        pillTones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/**
 * Admin listing table. The shell owns the border and the rounding so the
 * table itself can stay a plain `<table>`; `overflow-x-auto` is the escape
 * hatch for narrow screens, and secondary columns are dropped with
 * `hidden md:table-cell` before it ever comes to that.
 */
export function TableShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-x-auto rounded-2xl border border-border bg-card",
        className,
      )}
    >
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  );
}

/** Column heading: label-small, muted, on the sunken header band. */
export const thClass =
  "whitespace-nowrap px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.06em] text-muted-foreground";

/** Body cell. Rows are separated by a hairline rather than boxed. */
export const tdClass =
  "border-t border-border px-4 py-3 align-middle text-foreground";

/** Row: a faint hover so the pointer has something to land on. */
export const trClass = "transition-colors hover:bg-surface-sunken";
