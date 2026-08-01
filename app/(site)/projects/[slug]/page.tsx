import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Globe, Smartphone } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import {
  getProjectBySlug,
  getProjects,
  getProjectCategories,
} from "@/db/queries";

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
  const categories = await getProjectCategories();

  if (!project) notFound();

  const category = categories.find((c) => c.id === project.categoryId)?.name;

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
      label: "See the code",
      href: project.github,
      icon: GithubIcon,
    },
  ].filter(Boolean) as {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];

  return (
    <article>
      <div className="gfs-hero bg-background">
        <div className="gfs-container">
          <Reveal>
            <Link
              href="/projects"
              className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors duration-200 ease-standard hover:text-foreground"
            >
              <ArrowLeft className="size-5" aria-hidden />
              All projects
            </Link>

            {category && (
              <p className="mb-4 text-sm font-medium text-muted-foreground">
                {category}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-4">
              <h1 className="max-w-[20ch] text-hero leading-[1.08] tracking-[-0.02em]">
                {project.name}
              </h1>
              {project.status && (
                <span className="rounded-lg bg-accent px-2 py-1 text-xs font-medium text-accent-foreground">
                  {project.status}
                </span>
              )}
            </div>
          </Reveal>

          {project.coverImage && (
            <Reveal delay={80}>
              <div className="relative mt-12 aspect-video w-full overflow-hidden rounded-3xl bg-surface-sunken">
                <Image
                  src={project.coverImage}
                  alt={`A screen from ${project.name}.`}
                  fill
                  sizes="(max-width: 1280px) 100vw, 1120px"
                  className="object-cover"
                  priority
                />
              </div>
            </Reveal>
          )}
        </div>
      </div>

      <div className="gfs-section bg-surface-tinted">
        <div className="gfs-container grid gap-12 md:grid-cols-[1fr_320px] md:gap-16">
          <Reveal>
            <h2 className="text-band leading-[1.2] tracking-[-0.01em]">
              What it does.
            </h2>
            <ul className="mt-8 space-y-4">
              {project.description.map((line, i) => (
                <li
                  key={i}
                  className="flex max-w-[60ch] gap-4 text-muted-foreground"
                >
                  <span
                    aria-hidden
                    className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary"
                  />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={80}>
            {project.technologies.length > 0 && (
              <>
                <h2 className="text-base font-medium">Built with</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.technologies.map((tech, i) => (
                    <span
                      key={`${tech}-${i}`}
                      className="inline-flex h-8 items-center rounded-full border border-border px-4 text-sm font-medium text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </>
            )}

            {links.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-3">
                {links.map((link, i) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      buttonVariants({
                        variant: i === 0 ? "default" : "outline",
                      }),
                    )}
                  >
                    <link.icon className="size-5" />
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </Reveal>
        </div>
      </div>
    </article>
  );
}
