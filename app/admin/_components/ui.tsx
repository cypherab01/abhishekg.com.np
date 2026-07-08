import { cn } from "@/lib/utils";

/** Shared input styling used across admin forms. */
export const inputClass =
  "w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground shadow-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary/60 focus:ring-4 focus:ring-primary/10";

/**
 * Compact, inline-edit input used inside list rows — borderless at rest,
 * revealing a border and ring on hover/focus for a lightweight editable feel.
 */
export const rowInputClass =
  "w-full min-w-0 rounded-lg border border-transparent bg-transparent px-2.5 py-1.5 text-sm font-medium text-foreground outline-none transition-all placeholder:text-muted-foreground/60 hover:border-border hover:bg-card focus:border-primary/60 focus:bg-card focus:ring-4 focus:ring-primary/10";

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
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        {action}
      </div>
      {description && (
        <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

/** Elevated surface card matching the CRM dashboard theme. */
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
        "card-elevated rounded-2xl border border-border bg-card",
        className,
      )}
    >
      {children}
    </div>
  );
}

type AlertTone = "error" | "success" | "info";

const alertTones: Record<AlertTone, string> = {
  error:
    "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300",
  success:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  info: "border-primary/30 bg-primary/5 text-foreground",
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
        "mb-6 flex items-start gap-2.5 rounded-xl border p-3.5 text-sm",
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
  neutral: "bg-muted text-muted-foreground",
  success:
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-inset ring-emerald-500/20",
  danger:
    "bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-1 ring-inset ring-rose-500/20",
  accent: "bg-primary/10 text-primary ring-1 ring-inset ring-primary/20",
};

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
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        pillTones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
