import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Globe, Smartphone } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { getProjectBySlug, getProjects } from "@/db/queries";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  return { title: project ? project.name : "Project" };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  const links = [
    project.website && {
      label: "Visit website",
      href: project.website,
      icon: Globe,
    },
    project.playStore && {
      label: "Google Play",
      href: project.playStore,
      icon: Smartphone,
    },
    project.github && {
      label: "Source code",
      href: project.github,
      icon: GithubIcon,
    },
  ].filter(Boolean) as {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];

  return (
    <article className="py-16 md:py-24">
      <Reveal>
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
        >
          <ArrowLeft className="size-4" />
          All projects
        </Link>
      </Reveal>

      <Reveal delay={80}>
        {project.category && (
          <p className="text-sm font-medium tracking-[0.15em] text-primary mb-3">
            {project.category.toUpperCase()}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <h1 className="text-3xl md:text-4xl font-light text-foreground leading-tight">
            {project.name}
          </h1>
          {project.status && (
            <span className="text-xs px-2 py-0.5 rounded-full border border-primary/30 text-primary">
              {project.status}
            </span>
          )}
        </div>
      </Reveal>

      {project.coverImage && (
        <Reveal delay={120}>
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted mb-8">
            <Image
              src={project.coverImage}
              alt={project.name}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
            />
          </div>
        </Reveal>
      )}

      <Reveal delay={160}>
        <ul className="space-y-2.5 mb-8">
          {project.description.map((line, i) => (
            <li
              key={i}
              className="flex gap-3 text-muted-foreground leading-relaxed"
            >
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </Reveal>

      {project.technologies.length > 0 && (
        <Reveal delay={200}>
          <p className="text-sm font-medium text-foreground mb-2">Built with</p>
          <div className="flex flex-wrap gap-1.5 mb-8">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="text-sm px-3 py-1 rounded-md border border-border text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        </Reveal>
      )}

      {links.length > 0 && (
        <Reveal delay={240}>
          <div className="flex flex-wrap gap-3">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                <link.icon className="size-4 mr-2" />
                {link.label}
              </a>
            ))}
          </div>
        </Reveal>
      )}
    </article>
  );
}
