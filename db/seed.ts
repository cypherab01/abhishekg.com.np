import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

config({ path: ".env" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing rows (idempotent seed)
  await db.delete(schema.resumeConfig);
  await db.delete(schema.skills);
  await db.delete(schema.skillCategories);
  await db.delete(schema.experiences);
  await db.delete(schema.experienceKinds);
  await db.delete(schema.projects);
  await db.delete(schema.education);
  await db.delete(schema.profile);

  // ---- Profile ----
  const seedProfile = {
    id: 1,
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
    about:
      "I'm a Software Developer based in Kathmandu, Nepal, with hands-on experience building full-stack web and mobile applications across frontend, backend, and database layers. I enjoy turning real-world inefficiencies into clean, scalable software and shipping production features end to end. My core stack revolves around React, Next.js, React Native, and FastAPI, backed by PostgreSQL. I've delivered public-facing government platforms, international flight-booking UIs, and open-source mobile apps, and I've also taught full-stack development to the next generation of developers.",
  };
  await db.insert(schema.profile).values(seedProfile);

  // ---- Experience kinds ----
  const experienceKindRows = await db
    .insert(schema.experienceKinds)
    .values([
      { name: "work", sortOrder: 0 },
      { name: "teaching", sortOrder: 1 },
    ])
    .returning();
  const experienceKindIdByName = new Map(
    experienceKindRows.map((kind) => [kind.name, kind.id]),
  );

  // ---- Experience (work + teaching) ----
  const work = [
    {
      title: "Software Developer",
      company: "Kathmandu Metropolitan City",
      location: "Kathmandu, Nepal",
      startDate: "Jan 2026",
      endDate: "Present",
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
      startDate: "Dec 2024",
      endDate: "Jan 2026",
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
      title: "CloudWorker",
      company: "CloudFactory",
      location: "Lalitpur, Nepal",
      startDate: "Dec 2023",
      endDate: "Jan 2026",
      current: false,
      responsibilities: [
        "Contributed to data annotation and curation projects supporting machine learning model training.",
        "Maintained strong accuracy, confidentiality, and project-level performance standards.",
      ],
      technologies: ["Data Annotation", "Machine Learning Operations"],
    },
  ];

  const teaching = [
    {
      title: "Full Stack Development Instructor",
      startDate: "Apr 2026",
      endDate: "May 2026",
      responsibilities: [
        "Designed and taught a 30-session full-stack development course.",
        "Covered React 18, Vite, Tailwind CSS, React Router, FastAPI, PostgreSQL, SQLAlchemy 2.0, Alembic, JWT Authentication, and RBAC.",
        "Conducted labs, code reviews, and project workshops.",
        "Mentored students to build and deploy full-stack applications.",
      ],
    },
    {
      title: "Instructor (CTEVT)",
      startDate: "Mar 2023",
      endDate: "Jan 2024",
      responsibilities: [
        "Taught C programming, C++, and Web Technology.",
        "Delivered structured lessons and hands-on practical sessions.",
      ],
    },
  ];

  const insertedExperiences = await db
    .insert(schema.experiences)
    .values([
      ...work.map((e, i) => ({
        ...e,
        kindId: experienceKindIdByName.get("work")!,
        sortOrder: i,
      })),
      ...teaching.map((e, i) => ({
        kindId: experienceKindIdByName.get("teaching")!,
        title: e.title,
        company: "",
        location: "",
        startDate: e.startDate,
        endDate: e.endDate,
        current: false,
        responsibilities: e.responsibilities,
        technologies: [] as string[],
        sortOrder: i,
      })),
    ])
    .returning();

  // ---- Projects ----
  const projectCategories = [
    "Academic Resource Platform",
    "Open Source Mobile Application",
    "Full Stack Application",
  ];
  const insertedProjectCategories = await db
    .insert(schema.projectCategories)
    .values(
      projectCategories.map((name, sortOrder) => ({ name, sortOrder })),
    )
    .returning();
  const projectCategoryIdByName = new Map(
    insertedProjectCategories.map((category) => [category.name, category.id]),
  );

  const projects = [
    {
      name: "bitinfonepal.com",
      status: "Active",
      website: "https://bitinfonepal.com",
      playStore: null as string | null,
      github: null as string | null,
      technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
      description: [
        "Built a platform serving BIT students across all 8 semesters.",
        "Provides notes, syllabi, past papers, and solutions.",
        "Supports community contributions from students.",
        "Focused on performance, clean navigation, and mobile usability.",
      ],
      featured: true,
    },
    {
      name: "Baraabar: Split Bills",
      status: "",
      website: null,
      playStore:
        "https://play.google.com/store/apps/details?id=com.cypherab01.baraabar",
      github: null,
      technologies: ["React Native", "Expo"],
      description: [
        "Offline-first bill splitting application.",
        "Supports equal and partial expense sharing.",
        "Provides automatic settlement calculations.",
        "Includes backup, export, import, and privacy-first data ownership.",
        "Published on Google Play Store.",
      ],
      featured: true,
    },
    {
      name: "Driving Center Management System",
      status: "",
      website: null,
      playStore: null,
      github: null,
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
      featured: false,
    },
  ];

  const insertedProjects = await db
    .insert(schema.projects)
    .values(
      projects.map((p, i) => ({
        ...p,
        categoryId: projectCategoryIdByName.get(p.name === "bitinfonepal.com" ? "Academic Resource Platform" : p.name === "Baraabar: Split Bills" ? "Open Source Mobile Application" : "Full Stack Application")!,
        slug: slugify(p.name),
        sortOrder: i,
      })),
    )
    .returning();

  // ---- Education ----
  const education = [
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
      description: "",
    },
    {
      degree: "Physical Science",
      institution: "Deep Boarding High School",
      university: "NEB",
      faculty: "",
      location: "Butwal, Nepal",
      startDate: "2018-07",
      endDate: "2020-10",
      cgpa: null,
      cgpaScale: null,
      description:
        "I completed my higher secondary education in Physical Science from Deep Boarding High School, Butwal.",
    },
    {
      degree: "Secondary Education",
      institution: "Motherland English School",
      university: "SEE",
      faculty: "",
      location: "Butwal, Nepal",
      startDate: "2005-04",
      endDate: "2018-03",
      cgpa: null,
      cgpaScale: null,
      description:
        "I completed my foundational education up to SEE at Motherland English School.",
    },
  ];

  const insertedEducation = await db
    .insert(schema.education)
    .values(education.map((e, i) => ({ ...e, sortOrder: i })))
    .returning();

  // ---- Skills ----
  const skillGroups: Record<string, string[]> = {
    Languages: ["TypeScript", "JavaScript", "Python", "HTML", "CSS"],
    Frontend: [
      "React",
      "Next.js",
      "React Native",
      "Expo",
      "Tailwind CSS",
      "shadcn/ui",
      "TanStack Query",
    ],
    Backend: ["FastAPI", "SQLAlchemy", "Pydantic", "Node.js", "Express.js"],
    Databases: ["PostgreSQL", "MongoDB"],
    Tools: [
      "Git",
      "GitHub",
      "Docker",
      "Cloudflare",
      "Vercel",
      "Postman",
      "Linux Administration",
      "macOS",
    ],
  };

  const insertedCategories = await db
    .insert(schema.skillCategories)
    .values(
      Object.keys(skillGroups).map((name, sortOrder) => ({ name, sortOrder })),
    )
    .returning();

  const categoryIdByName = new Map(
    insertedCategories.map((category) => [category.name, category.id]),
  );

  const skillRows = Object.entries(skillGroups).flatMap(([category, items]) =>
    items.map((name, i) => ({
      categoryId: categoryIdByName.get(category)!,
      name,
      sortOrder: i,
    })),
  );
  const insertedSkills = await db
    .insert(schema.skills)
    .values(skillRows)
    .returning();

  // ---- Resume config ----
  // Defaults to everything selected, matching ensureResumeConfig()'s
  // first-run behavior — the admin can then trim it down in /admin/resume.
  await db.insert(schema.resumeConfig).values({
    id: 1,
    summary: seedProfile.summary,
    sections: schema.DEFAULT_RESUME_SECTIONS,
    headerFields: schema.DEFAULT_RESUME_HEADER_FIELDS,
    experienceIds: insertedExperiences.map((row) => row.id),
    educationIds: insertedEducation.map((row) => row.id),
    skillIds: insertedSkills.map((row) => row.id),
    projectIds: insertedProjects.map((row) => row.id),
  });

  console.log("✅ Seed complete");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seed failed", err);
  process.exit(1);
});
