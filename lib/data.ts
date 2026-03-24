export const personalInfo = {
  name: "Abhishek Ghimire",
  initials: "AG",
  role: "Software Developer",
  email: "aghimire074@gmail.com",
  github: "https://github.com/cypherab01",
  website: "https://abhishekg.com.np",
  about:
    "A Software Developer specializing in full-stack web application development, with a focus on Next.js, React for frontend development and FastAPI for backend development.",
} as const;

export interface Experience {
  company: string;
  location: string;
  title: string;
  date?: string;
  description: string;
  skills: string[];
}

export const experiences: Experience[] = [
  {
    company: "Kathmandu Metropolitan City",
    location: "Kathmandu, Nepal",
    title: "Software Developer",
    description:
      "Developed the official KMC website with responsive UI/UX and the BID Management System with role-based access control for managing BID publications on Gorkhapatra.",
    skills: [
      "Next.js",
      "FastAPI",
      "shadcn/ui",
      "TanStack Query",
      "AuthJS",
      "SQLAlchemy",
      "PostgreSQL",
    ],
  },
  {
    company: "Mantra IT Solution Pvt. Ltd.",
    location: "Lalitpur, Nepal",
    title: "Website & Mobile App Developer",
    date: "Dec 2024 – Jan 2026",
    description:
      "Built Harvestmoon international flight booking app, Shreeairlines domestic airline frontend, and E-Grow Easy Farming mobile application.",
    skills: [
      "React",
      "Next.js",
      "React Native",
      "Laravel",
      "shadcn/ui",
      "TanStack Query",
    ],
  },
];

export interface Project {
  title: string;
  description: string;
  skills: string[];
}

export const projects: Project[] = [
  {
    title: "KMC Website",
    description:
      "Official Kathmandu Metropolitan City website with responsive UI/UX design.",
    skills: ["Next.js", "Tailwind CSS", "FastAPI"],
  },
  {
    title: "BID Management System",
    description:
      "Web application to manage BID publications of Kathmandu Metropolitan City on Gorkhapatra with role-based access control.",
    skills: ["Next.js", "FastAPI", "PostgreSQL", "AuthJS"],
  },
  {
    title: "Harvestmoon",
    description: "International flight ticket booking application.",
    skills: ["React", "Next.js", "shadcn/ui", "TanStack Query"],
  },
  {
    title: "Shreeairlines",
    description: "Frontend development for Nepal's domestic airline.",
    skills: ["Laravel Blade"],
  },
  {
    title: "E-Grow Easy Farming",
    description:
      "Mobile app revolutionizing agricultural practices through advanced ARP technology.",
    skills: ["React Native CLI"],
  },
  {
    title: "bitinfonepal.com",
    description:
      "Educational platform for BIT students in Nepal, featuring resources, quizzes, and official notices.",
    skills: ["Next.js"],
  },
];

export interface Education {
  degree: string;
  institution: string;
  date: string;
}

export const education: Education[] = [
  {
    degree: "Bachelor's in Information Technology (BIT)",
    institution: "Patan Multiple Campus, Tribhuvan University",
    date: "Mar 2021 – Jun 2025",
  },
  {
    degree: "Physical Science (Higher Secondary)",
    institution: "Deep Boarding High School, Butwal, NEB",
    date: "Jul 2018 – Oct 2020",
  },
  {
    degree: "Secondary Education (SEE)",
    institution: "Motherland English School",
    date: "Apr 2005 – Mar 2018",
  },
];

export const skillCategories = [
  {
    label: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "HTML", "CSS"],
  },
  {
    label: "Frontend",
    items: ["React", "Next.js", "Tailwind CSS", "shadcn/ui", "React Native"],
  },
  {
    label: "Backend",
    items: ["FastAPI", "Node.js", "Express.js", "SQLAlchemy", "Pydantic"],
  },
  {
    label: "Databases",
    items: ["PostgreSQL", "MongoDB"],
  },
  {
    label: "Tools",
    items: [
      "Git",
      "GitHub",
      "Docker",
      "CloudFlare",
      "Vercel",
      "Postman",
      "Linux & Linux Administration",
      "macOS",
    ],
  },
] as const;

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Education", href: "#education" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
] as const;
