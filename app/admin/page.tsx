import Link from "next/link";
import {
  Briefcase,
  FolderGit2,
  GraduationCap,
  Wrench,
  MessageSquare,
  User,
} from "lucide-react";
import {
  getAllExperiences,
  getProjects,
  getEducation,
  getSkills,
  getMessages,
} from "@/db/queries";

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

  const cards = [
    { label: "Profile", href: "/admin/profile", icon: User, count: null },
    {
      label: "Experience",
      href: "/admin/experience",
      icon: Briefcase,
      count: experiences.length,
    },
    {
      label: "Projects",
      href: "/admin/projects",
      icon: FolderGit2,
      count: projects.length,
    },
    {
      label: "Education",
      href: "/admin/education",
      icon: GraduationCap,
      count: education.length,
    },
    { label: "Skills", href: "/admin/skills", icon: Wrench, count: skills.length },
    {
      label: "Messages",
      href: "/admin/messages",
      icon: MessageSquare,
      count: messages.length,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-light text-foreground">Dashboard</h1>
      <p className="mt-1 mb-8 text-sm text-muted-foreground">
        Manage all content on your portfolio.
        {unread > 0 && (
          <>
            {" "}
            You have{" "}
            <Link href="/admin/messages" className="text-primary underline">
              {unread} unread message{unread === 1 ? "" : "s"}
            </Link>
            .
          </>
        )}
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group rounded-lg border border-border p-5 transition-colors hover:border-primary/30 hover:bg-muted/30"
          >
            <card.icon className="size-5 text-muted-foreground transition-colors group-hover:text-primary" />
            <p className="mt-3 font-medium text-foreground">{card.label}</p>
            {card.count !== null && (
              <p className="text-sm text-muted-foreground">
                {card.count} {card.count === 1 ? "entry" : "entries"}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
