import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Globe, Smartphone } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import {
  ProjectHeroShot,
  ProjectMarquee,
} from "@/components/ui/project-gallery";
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
              className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors duration-200 ease-standard hover:text-foreground"
            >
              <ArrowLeft className="size-5" aria-hidden />
              All projects
            </Link>

            {/* Category and status share the eyebrow line: the status is
                metadata about the project, not a counterweight to its name. */}
            {(category || project.status) && (
              <div className="mb-3 flex flex-wrap items-center gap-3">
                {category && (
                  <p className="text-sm font-medium text-muted-foreground">
                    {category}
                  </p>
                )}
                {project.status && (
                  <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground">
                    {project.status}
                  </span>
                )}
              </div>
            )}
            <h1 className="max-w-[22ch] text-section leading-[1.12] tracking-[-0.015em]">
              {project.name}
            </h1>
          </Reveal>
        </div>

        {/* Both live outside the container: the shot grows past the content
            column as it rises, and the strip runs edge to edge. */}
        {project.images[0] && (
          <ProjectHeroShot src={project.images[0]} name={project.name} />
        )}

        {project.images.length > 1 && (
          <ProjectMarquee images={project.images} name={project.name} />
        )}
      </div>

      <div className="gfs-section bg-surface-tinted">
        <div className="gfs-container grid gap-12 md:grid-cols-[1fr_320px] md:gap-16">
          <Reveal>
            <h2 className="text-band leading-[1.2] tracking-[-0.01em]">
              What I worked on.
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
