"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Delay in ms before the element animates in (used for staggering). */
  delay?: number;
}

/**
 * Reveals its children with a subtle fade + rise once they scroll into view.
 * Uses IntersectionObserver, animates only once, and fully respects
 * `prefers-reduced-motion` via the `motion-reduce` utilities.
 */
export function Reveal({ children, className, delay = 0, ...props }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-[opacity,transform]",
        visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
        "motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
