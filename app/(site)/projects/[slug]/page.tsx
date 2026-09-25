import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Globe, Smartphone } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { ProjectShowcase } from "@/components/ui/project-gallery";
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
  const [project, categories, projects] = await Promise.all([
    getProjectBySlug(slug),
    getProjectCategories(),
    getProjects(),
  ]);

  if (!project) notFound();

  const category = categories.find((c) => c.id === project.categoryId)?.name;

  // The lead carries the first line of the write-up, so the list below starts
  // at the second: the same sentence twice reads like a template, not a page.
  const [lead, ...detail] = project.description;

  // Wraps around, so the last project still offers somewhere to go next.
  const current = projects.findIndex((p) => p.slug === project.slug);
  const next =
    projects.length > 1 ? projects[(current + 1) % projects.length] : null;
  const nextCategory = next
    ? categories.find((c) => c.id === next.categoryId)?.name
    : undefined;

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
      {/* The tint is painted as the hero's own background image rather than as
          a layer: an absolutely positioned one would need `isolate` here, and
          that stacking context puts the screenshot viewer behind the navbar. */}
      <div
        className="gfs-hero bg-background"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, var(--color-surface-tinted), transparent 460px)",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="gfs-container">
          {/* Navigation, not part of the announcement — it keeps the left edge
              while everything below it is centred. */}
          <Reveal>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors duration-200 ease-standard hover:text-foreground"
            >
              <ArrowLeft className="size-5" aria-hidden />
              All projects
            </Link>
          </Reveal>

          {/* A centred column, the way a launch page reads. The title is given
              the full measure so it lands in two lines instead of stacking
              three deep against an empty half-page. */}
          <Reveal className="mx-auto mt-10 max-w-4xl text-center">
            {(category || project.status) && (
              <div className="flex flex-wrap items-center justify-center gap-3">
                {category && (
                  <p className="text-sm font-medium text-muted-foreground">
                    {category}
                  </p>
                )}
                {project.status && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground">
                    <span
                      aria-hidden
                      className="size-1.5 rounded-full bg-current"
                    />
                    {project.status}
                  </span>
                )}
              </div>
            )}

            <h1 className="mt-4 text-section leading-[1.1] tracking-[-0.015em]">
              {project.name}
            </h1>

            {lead && (
              <p className="mx-auto mt-6 max-w-[62ch] text-lead leading-[1.5] text-muted-foreground">
                {lead}
              </p>
            )}

            {/* The stack belongs with the title, not in a panel under a
                heading: it is part of what the project is, and naming it
                "Built with" only adds furniture. */}
            {project.technologies.length > 0 && (
              <ul className="mt-7 flex flex-wrap items-center justify-center gap-2">
                {project.technologies.map((tech, i) => (
                  <li
                    key={`${tech}-${i}`}
                    className="inline-flex h-8 items-center rounded-full border border-border px-4 text-sm font-medium text-muted-foreground"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            )}

            {links.length > 0 && (
              <div className="mt-8 flex flex-wrap justify-center gap-3">
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

        {/* Outside the container on purpose: the cover shot grows past the
            content column as it rises, and the strips run edge to edge. */}
        <ProjectShowcase images={project.images} name={project.name} />
      </div>

      {detail.length > 0 && (
        <div className="gfs-section bg-surface-tinted">
          <div className="gfs-container">
            <Reveal>
              <h2 className="max-w-[16ch] text-band leading-[1.2] tracking-[-0.01em]">
                What I worked on.
              </h2>
            </Reveal>

            {/* Two columns of cards rather than one column beside an empty
                rail: the write-up fills the width it is given. */}
            <ol className="mt-10 grid gap-4 md:grid-cols-2">
              {detail.map((line, i) => (
                <li key={i} className="h-full">
                  {/* The reveal wrapper lives inside the list item: a div
                      between <ol> and <li> is invalid nesting. */}
                  <Reveal
                    delay={(i % 2) * 60}
                    className="flex h-full gap-5 rounded-3xl bg-background p-6 transition-shadow duration-200 ease-standard hover:shadow-elev-2 sm:p-7"
                  >
                    <span
                      aria-hidden
                      className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-medium text-accent-foreground"
                    >
                      {i + 1}
                    </span>
                    <span className="text-muted-foreground">{line}</span>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}

      {next && (
        <div className="gfs-section bg-background">
          <div className="gfs-container">
            <Reveal>
              <Link
                href={`/projects/${next.slug}`}
                className="group flex flex-col gap-6 rounded-3xl border border-border p-8 transition-shadow duration-200 ease-standard hover:shadow-elev-2 sm:flex-row sm:items-center sm:justify-between sm:p-10"
              >
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.08em] text-subtle-foreground">
                    Next project
                  </p>
                  <p className="mt-2 text-band leading-[1.2] tracking-[-0.01em]">
                    {next.name}
                  </p>
                  {nextCategory && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {nextCategory}
                    </p>
                  )}
                </div>
                <span
                  aria-hidden
                  className="flex size-14 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground transition-transform duration-200 ease-emphasized group-hover:translate-x-1"
                >
                  <ArrowRight className="size-6" />
                </span>
              </Link>
            </Reveal>
          </div>
        </div>
      )}
    </article>
  );
}
