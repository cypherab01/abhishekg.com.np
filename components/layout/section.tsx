import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";

interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Section({ id, title, children, className }: SectionProps) {
  return (
    <section id={id} className={cn("py-16 md:py-24", className)}>
      <Reveal>
        <p className="text-xs font-medium tracking-[0.2em] text-primary mb-6 md:mb-8">
          {title.toUpperCase()}
        </p>
      </Reveal>
      {children}
    </section>
  );
}
