import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

interface ProjectCardProps {
  title: string;
  description: string;
  skills: string[];
  category?: string;
  coverImage?: string | null;
  href?: string;
}

export function ProjectCard({
  title,
  description,
  skills,
  category,
  coverImage,
  href,
}: ProjectCardProps) {
  const inner = (
    <div className="group h-full rounded-lg border border-border overflow-hidden transition-[colors,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-muted/30 hover:shadow-sm motion-reduce:hover:translate-y-0">
      {coverImage && (
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <Image
            src={coverImage}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, 400px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <div>
            {category && (
              <p className="text-xs font-medium tracking-wide text-primary mb-1">
                {category}
              </p>
            )}
            <h3 className="font-medium text-foreground">{title}</h3>
          </div>
          {href && (
            <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          )}
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-3">
          {description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {skills.map((skill) => (
            <span
              key={skill}
              className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {inner}
      </Link>
    );
  }
  return inner;
}
