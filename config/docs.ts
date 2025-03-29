import { MainNavItem, SidebarNavItem } from "@/types/nav";

export interface DocsConfig {
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
  chartsNav: SidebarNavItem[];
}

export const docsConfig = {
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Blog",
      href: "/blog",
    },
  ],
  sidebarNav: [
    {
      title: "Getting Started",
      items: [
        {
          title: "Introduction",
          href: "/",
          items: [],
        },
        {
          title: "About Me",
          href: "/about-me",
          items: [],
        },
        {
          title: "Projects & Portfolio",
          href: "/projects",
          items: [],
        },
        {
          title: "Skills & Tools",
          href: "/skills-tools",
          items: [],
        },
        {
          title: "Experience",
          href: "/experience",
          items: [],
        },
        {
          title: "Education",
          href: "/education",
          items: [],
        },
        {
          title: "Testimonials",
          href: "/testimonials",
          items: [],
        },
        {
          title: "Contact",
          href: "/contact",
          items: [],
        },
      ],
    },
  ],
};
