import Link from "next/link";
import {
  Briefcase,
  FolderGit2,
  GraduationCap,
  Wrench,
  MessageSquare,
  User,
  ArrowUpRight,
  Plus,
  Inbox,
} from "lucide-react";
import {
  getAllExperiences,
  getProjects,
  getEducation,
  getSkills,
  getMessages,
} from "@/db/queries";
import { cn } from "@/lib/utils";
import { Card } from "./_components/ui";

export default async function AdminDashboard() {
  const [experiences, projects, education, skills, messages] =
    await Promise.all([
      getAllExperiences(),
      getProjects(),
      getEducation(),
      getSkills(),
      getMessages(),
    ]);

  const unread = messages.filter((m) => !m.read).length;
  const recent = messages.slice(0, 5);

  const stats = [
    {
      label: "Experience",
      href: "/admin/experience",
      icon: Briefcase,
      count: experiences.length,
      tint: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
    },
    {
      label: "Projects",
      href: "/admin/projects",
      icon: FolderGit2,
      count: projects.length,
      tint: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    {
      label: "Education",
      href: "/admin/education",
      icon: GraduationCap,
      count: education.length,
      tint: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Skills",
      href: "/admin/skills",
      icon: Wrench,
      count: skills.length,
      tint: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    },
    {
      label: "Messages",
      href: "/admin/messages",
      icon: MessageSquare,
      count: messages.length,
      tint: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    },
  ];

  const quickActions = [
    { label: "New project", href: "/admin/projects/new", icon: FolderGit2 },
    { label: "New experience", href: "/admin/experience/new", icon: Briefcase },
    { label: "New education", href: "/admin/education/new", icon: GraduationCap },
    { label: "Edit profile", href: "/admin/profile", icon: User },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          An overview of everything on your portfolio.
          {unread > 0 && (
            <>
              {" "}
              You have{" "}
              <Link
                href="/admin/messages?tab=unread"
                className="font-medium text-primary hover:underline"
              >
                {unread} unread message{unread === 1 ? "" : "s"}
              </Link>
              .
            </>
          )}
        </p>
      </header>

      {/* Stat cards */}
      <section aria-label="Content overview">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map((stat) => (
            <Link
              key={stat.href}
              href={stat.href}
              className="card-elevated group rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "flex size-10 items-center justify-center rounded-xl",
                    stat.tint,
                  )}
                >
                  <stat.icon className="size-5" aria-hidden />
                </span>
                <ArrowUpRight className="size-4 text-muted-foreground/40 transition-colors group-hover:text-primary" aria-hidden />
              </div>
              <p className="mt-4 text-2xl font-semibold tabular-nums text-foreground">
                {stat.count}
              </p>
              <p className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent messages + quick actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold text-foreground">
              Recent messages
            </h2>
            <Link
              href="/admin/messages"
              className="text-sm font-medium text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          {recent.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-5 py-12 text-center">
              <Inbox className="size-6 text-muted-foreground/50" aria-hidden />
              <p className="text-sm text-muted-foreground">No messages yet.</p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {recent.map((msg) => (
                <li key={msg.id}>
                  <Link
                    href="/admin/messages"
                    className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-muted/50"
                  >
                    <span
                      className={cn(
                        "size-2 shrink-0 rounded-full",
                        msg.read ? "bg-transparent" : "bg-primary",
                      )}
                      aria-hidden
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span
                          className={cn(
                            "truncate text-sm",
                            msg.read
                              ? "font-medium text-foreground"
                              : "font-semibold text-foreground",
                          )}
                        >
                          {msg.name}
                        </span>
                        {!msg.read && (
                          <span className="sr-only">(unread)</span>
                        )}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {msg.message}
                      </span>
                    </span>
                    <time className="shrink-0 text-xs text-muted-foreground">
                      {msg.createdAt.toLocaleDateString()}
                    </time>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-semibold text-foreground">
            Quick actions
          </h2>
          <div className="mt-4 grid gap-2">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center gap-3 rounded-xl border border-border bg-background/40 px-3.5 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <action.icon className="size-4" aria-hidden />
                </span>
                {action.label}
                <Plus className="ml-auto size-4 text-muted-foreground/50" aria-hidden />
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
