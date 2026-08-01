import { cva, type VariantProps } from "class-variance-authority"

/**
 * Every button is a pill. Emphasis descends filled → tonal → outlined → text;
 * use one filled button per section, or the hierarchy stops meaning anything.
 * Hover on filled adds a faint shadow and never lifts the button.
 */
export const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-transparent bg-clip-padding font-medium whitespace-nowrap outline-none select-none transition-[background-color,box-shadow,border-color,color] duration-200 ease-standard focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:bg-surface-sunken disabled:text-subtle-foreground disabled:shadow-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-[var(--gfs-accent-hover)] hover:shadow-elev-1 active:bg-[var(--gfs-accent-pressed)] active:shadow-none",
        tonal:
          "bg-accent text-accent-foreground hover:bg-[var(--gfs-blue-100)] dark:hover:bg-[var(--gfs-accent-container)]",
        outline:
          "border-border bg-transparent text-link hover:border-primary hover:bg-primary/5",
        secondary:
          "bg-surface-sunken text-foreground hover:bg-[var(--gfs-outline-variant)]",
        ghost: "bg-transparent text-link hover:bg-primary/5",
        destructive:
          "bg-danger-container text-on-danger-container hover:bg-danger-container/70",
        "on-dark":
          "bg-white text-[var(--gfs-grey-900)] hover:bg-[var(--gfs-grey-100)]",
        "on-dark-outline":
          "border-[var(--gfs-grey-700)] bg-transparent text-white hover:border-[var(--gfs-grey-500)] hover:bg-white/10",
        link: "h-auto px-0 text-link underline-offset-4 hover:underline",
      },
      size: {
        /** Dense product UI — admin, toolbars, inline actions. */
        default: "h-10 px-5 text-sm",
        sm: "h-8 px-4 text-sm",
        /** Marketing pages — heroes, section CTAs. */
        lg: "h-12 px-8 text-base",
        icon: "size-10 px-0 [&_svg:not([class*='size-'])]:size-5",
        "icon-sm": "size-8 px-0 [&_svg:not([class*='size-'])]:size-4",
        "icon-lg": "size-12 px-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export type ButtonVariantProps = VariantProps<typeof buttonVariants>
