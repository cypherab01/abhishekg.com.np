import Link from "next/link";
import {
  Briefcase,
  FolderGit2,
  GraduationCap,
  Wrench,
  MessageSquare,
  User,
  ChevronRight,
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

  // One accent, used consistently — a colour per card would read as decoration
  // rather than information.
  const stats = [
    { label: "Experience", href: "/admin/experience", icon: Briefcase, count: experiences.length },
    { label: "Projects", href: "/admin/projects", icon: FolderGit2, count: projects.length },
    { label: "Education", href: "/admin/education", icon: GraduationCap, count: education.length },
    { label: "Skills", href: "/admin/skills", icon: Wrench, count: skills.length },
    { label: "Messages", href: "/admin/messages", icon: MessageSquare, count: messages.length },
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
        <h1 className="text-2xl leading-8">Dashboard</h1>
        <p className="mt-2 max-w-[60ch] text-sm text-muted-foreground">
          An overview of everything on your portfolio.
          {unread > 0 && (
            <>
              {" "}
              You have{" "}
              <Link
                href="/admin/messages?tab=unread"
                className="font-medium text-link underline underline-offset-2"
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
              className="state-layer group rounded-2xl border border-outline-variant bg-surface-tinted p-5 transition-colors duration-200 ease-standard hover:border-border"
            >
              <div className="flex items-center justify-between">
                <span className="flex size-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <stat.icon className="size-5" aria-hidden />
                </span>
                <ChevronRight
                  className="size-5 text-subtle-foreground transition-transform duration-200 ease-standard group-hover:translate-x-[3px]"
                  aria-hidden
                />
              </div>
              <p className="mt-4 text-3xl leading-10 tabular-nums">
                {stat.count}
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent messages + quick actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between border-b border-outline-variant px-5 py-4">
            <h2 className="text-base font-medium">Recent messages</h2>
            <Link
              href="/admin/messages"
              className="text-sm font-medium text-link underline-offset-4 hover:underline"
            >
              View all
            </Link>
          </div>
          {recent.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-5 py-14 text-center">
              <Inbox className="size-6 text-subtle-foreground" aria-hidden />
              <p className="text-sm text-muted-foreground">
                No messages yet. Anything sent from the contact form lands here.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-outline-variant">
              {recent.map((msg) => (
                <li key={msg.id}>
                  <Link
                    href="/admin/messages"
                    className="state-layer flex items-center gap-3 px-5 py-4"
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
                        <span className="truncate text-sm font-medium text-foreground">
                          {msg.name}
                        </span>
                        {!msg.read && <span className="sr-only">(unread)</span>}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
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
          <h2 className="text-base font-medium">Quick actions</h2>
          <div className="mt-4 grid gap-2">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="state-layer flex h-14 items-center gap-3 rounded-full border border-outline-variant px-4 text-sm font-medium text-foreground transition-colors duration-200 ease-standard hover:border-border"
              >
                <span className="flex size-8 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <action.icon className="size-4" aria-hidden />
                </span>
                {action.label}
                <Plus className="ml-auto size-4 text-subtle-foreground" aria-hidden />
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
