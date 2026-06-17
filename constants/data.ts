export const websiteData = {
  personal: {
    name: "Abhishek Ghimire",
    initials: "AG",
    role: "Software Developer",
    location: "Kathmandu, Nepal",
    phone: "+977-9847526298",
    email: "aghimire074@gmail.com",
    website: "https://abhishekg.com.np",
    github: "https://github.com/cypherab01",
    linkedin: "https://linkedin.com/in/cypherab01",
    headline: "Software Developer",
    summary:
      "Software Developer with hands-on experience building full-stack web and mobile applications across frontend, backend, and database layers. Passionate about problem-solving and turning real-world inefficiencies into clean, scalable software. Comfortable shipping production features with React, Next.js, React Native, and FastAPI.",
  },
  experience: [
    {
      title: "Software Developer",
      company: "Kathmandu Metropolitan City",
      location: "Kathmandu, Nepal",
      startDate: "2026-01",
      endDate: null,
      current: true,
      responsibilities: [
        "Developing the official Kathmandu Metropolitan City website with responsive, accessible UI/UX and the BID Management System with role-based access control for managing BID publications on Gorkhapatra.",
        "Building public-facing and internal administrative modules with Next.js, FastAPI, SQLAlchemy, and PostgreSQL.",
        "Collaborating with database engineers and system analysts across frontend and backend development.",
      ],
      technologies: ["Next.js", "FastAPI", "SQLAlchemy", "PostgreSQL"],
    },
    {
      title: "Next.js & React Native Developer",
      company: "Mantra IT Solution Pvt. Ltd.",
      location: "Lalitpur, Nepal",
      startDate: "2024-12",
      endDate: "2026-01",
      current: false,
      responsibilities: [
        "Built the UI for Harvestmoon, an international flight booking web application.",
        "Developed the Shreeairlines domestic airline frontend.",
        "Contributed to the E-Grow Easy Farming mobile application.",
        "Converted Figma mockups into reusable React components using Tailwind CSS and shadcn/ui.",
        "Optimized applications for responsiveness and performance.",
      ],
      technologies: [
        "Next.js",
        "React",
        "React Native",
        "Tailwind CSS",
        "shadcn/ui",
      ],
    },
    {
      title: "Frontend Developer",
      company: "Aatharwa Media and Advertising Pvt. Ltd.",
      location: "Lalitpur, Nepal",
      startDate: "2024-06",
      endDate: "2025-08",
      current: false,
      responsibilities: [
        "Developed frontend interfaces for e-commerce and trading platforms.",
        "Implemented product listings, cart systems, and dashboard interfaces.",
        "Worked closely with designers and backend engineers to deliver production-ready UIs.",
      ],
      technologies: ["React", "JavaScript", "HTML", "CSS"],
    },
    {
      title: "CloudWorker",
      company: "CloudFactory",
      location: "Lalitpur, Nepal",
      startDate: "2023-12",
      endDate: "2026-01",
      current: false,
      responsibilities: [
        "Contributed to data annotation and curation projects supporting machine learning model training.",
        "Maintained strong accuracy, confidentiality, and project-level performance standards.",
      ],
      technologies: ["Data Annotation", "Machine Learning Operations"],
    },
  ],
  teaching: [
    {
      title: "Full Stack Development Instructor",
      startDate: "2026-04",
      endDate: "2026-05",
      responsibilities: [
        "Designed and taught a 30-session full-stack development course.",
        "Covered React 18, Vite, Tailwind CSS, React Router, FastAPI, PostgreSQL, SQLAlchemy 2.0, Alembic, JWT Authentication, and RBAC.",
        "Conducted labs, code reviews, and project workshops.",
        "Mentored students to build and deploy full-stack applications.",
      ],
    },
    {
      title: "Instructor (CTEVT)",
      startDate: "2023-03",
      endDate: "2024-01",
      responsibilities: [
        "Taught C programming, C++, and Web Technology.",
        "Delivered structured lessons and hands-on practical sessions.",
      ],
    },
  ],
  projects: [
    {
      name: "bitinfonepal.com",
      category: "Academic Resource Platform",
      status: "Active",
      website: "https://bitinfonepal.com",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
      description: [
        "Built a platform serving BIT students across all 8 semesters.",
        "Provides notes, syllabi, past papers, and solutions.",
        "Supports community contributions from students.",
        "Focused on performance, clean navigation, and mobile usability.",
      ],
    },
    {
      name: "Baraabar: Split Bills",
      category: "Open Source Mobile Application",
      playStore:
        "https://play.google.com/store/apps/details?id=com.cypherab01.baraabar",
      technologies: ["React Native", "Expo"],
      description: [
        "Offline-first bill splitting application.",
        "Supports equal and partial expense sharing.",
        "Provides automatic settlement calculations.",
        "Includes backup, export, import, and privacy-first data ownership.",
        "Published on Google Play Store.",
      ],
    },
    {
      name: "Driving Center Management System",
      category: "Full Stack Application",
      technologies: [
        "FastAPI",
        "PostgreSQL",
        "SQLAlchemy",
        "React Native",
        "Expo",
      ],
      description: [
        "Digitized driving center operations and records.",
        "Managed drivers, instructors, and practice sessions.",
        "Implemented JWT authentication and RBAC.",
        "Designed optimized relational database models.",
        "Integrated mobile application with REST APIs.",
      ],
    },
  ],
  skills: {
    languages: ["TypeScript", "JavaScript", "Python", "HTML", "CSS"],
    frontend: [
      "React",
      "Next.js",
      "React Native",
      "Expo",
      "Tailwind CSS",
      "shadcn/ui",
      "TanStack Query",
    ],
    backend: ["FastAPI", "SQLAlchemy", "Pydantic", "Node.js", "Express.js"],
    databases: ["PostgreSQL", "MongoDB"],
    tools: [
      "Git",
      "GitHub",
      "Docker",
      "Cloudflare",
      "Vercel",
      "Postman",
      "Linux Administration",
      "macOS",
    ],
  },
  education: [
    {
      degree: "Bachelor's in Information Technology (BIT)",
      institution: "Patan Multiple Campus",
      university: "Tribhuvan University",
      faculty: "IOST",
      location: "Patandhoka, Lalitpur, Nepal",
      startDate: "2021-03",
      endDate: "2025-06",
      cgpa: 3.51,
      cgpaScale: 4.0,
    },
    {
      degree: "Physical Science",
      institution: "Deep Boarding High School",
      university: "NEB",
      location: "Butwal, Nepal",
      startDate: "2018-07",
      endDate: "2020-10",
      description:
        "I completed my higher secondary education in Physical Science from Deep Boarding High School, Butwal.",
    },
    {
      degree: "Secondary Education",
      institution: "Motherland English School",
      university: "SEE",
      location: "Butwal, Nepal",
      startDate: "2005-04",
      endDate: "2018-03",
      description:
        "I completed my foundational education up to SEE at Motherland English School.",
    },
  ],
};

// Export individual items for component usage
export const personalInfo = websiteData.personal;

export const experiences = websiteData.experience;

export const projects = websiteData.projects;

export const education = websiteData.education;

export const skillCategories = [
  {
    label: "Languages",
    items: websiteData.skills.languages,
  },
  {
    label: "Frontend",
    items: websiteData.skills.frontend,
  },
  {
    label: "Backend",
    items: websiteData.skills.backend,
  },
  {
    label: "Databases",
    items: websiteData.skills.databases,
  },
  {
    label: "Tools",
    items: websiteData.skills.tools,
  },
];

export const navLinks = [
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Education", href: "#education" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
] as const;
