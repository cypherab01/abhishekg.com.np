export const navLinks = [
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Experience", href: "/#experience" },
  { label: "Skills", href: "/#skills" },
  { label: "Contact", href: "/#contact" },
] as const;

export const adminNavLinks = [
  { label: "Dashboard", href: "/admin", icon: "dashboard" },
  { label: "Profile", href: "/admin/profile", icon: "profile" },
  { label: "Experience", href: "/admin/experience", icon: "experience" },
  { label: "Projects", href: "/admin/projects", icon: "projects" },
  { label: "Education", href: "/admin/education", icon: "education" },
  { label: "Skills", href: "/admin/skills", icon: "skills" },
  { label: "Messages", href: "/admin/messages", icon: "messages" },
] as const;

export type AdminNavIcon = (typeof adminNavLinks)[number]["icon"];
