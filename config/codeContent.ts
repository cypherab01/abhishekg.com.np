export const code = {
  welcome: `// app/api/welcome/route.js
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Welcome to my portfolio!" });
}
`,
  aboutMe: `const superpower = () => "Writing clean, efficient, and user-friendly code!";
console.log(\`My superpower is: \${superpower()}\`);
`,
  skillsTools: `const mySkills = [
  "HTML", "CSS", "JavaScript", "TypeScript", "ReactJS", "NextJS", "Tailwind CSS",
  "shadcn/ui", "NodeJS", "ExpressJS", "MongoDB", "Git", "GitHub", "Vercel", 
  "Postman", "Linux", "macOS", "Windows", "pnpm", "npm", "yarn", "Docker", "Radix UI"
];

const getSkills = () => {
  return mySkills.length > 0 
    ? \`I have skills in: \${mySkills.join(", ")}! 💻🚀\`
    : "Skills not found... Panic!";
};

console.log(getSkills());
`,
  contact: `const contactDetails = {
    name: "Abhishek Ghimire",
    email: "hi@abhishekg.com.np",
    mobile: "+977-9847526298",
    location: "Balkhu, Kathmandu",
    linkedIn: "linkedin.com/in/cypherab01",
    github: "github.com/cypherab01",
  };
  
function reachOut() {
    console.log(\`Reach out to me via email at \${contactDetails.email} or connect on LinkedIn: \${contactDetails.linkedIn}\`);
  }
  
reachOut();
  `,
  education: `const BIT_Coursework = [
    "C Programming",
    "Data Structures",
    "Web Technology I & II",
    "Software Engineering",
    "Artificial Intelligence",
    "Database Administration",
    "Advanced Java Programming",
    "e-Commerce",
    "Cloud Computing",
  ];
  
console.log("Skills built through coursework:", BIT_Coursework.join(", "));`,
  experience: `const experience = [
    {
      role: "Senior Coffee Consumer",
      company: "Remote Office (My Desk)",
      duration: "Forever",
      skills: ["Caffeine Management", "Bug Staring", "Keyboard Jamming"],
    },
    {
      role: "Full-Stack Developer",
      company: "Stack Overflow Solutions Inc.",
      duration: "When Google is Available",
      skills: ["Copy-Pasting", "Fixing Bugs with Console.log", "Deploying & Praying"],
    },
    {
      role: "Intern",
      company: "My Own Side Projects",
      duration: "Since Birth",
      skills: ["Breaking Code", "Googling Errors", "Naming Variables Creatively"],
    },
  ];
  
  experience.forEach((job) => {
    console.log(
      \`👨‍💻 \${job.role} at \${job.company} (\${job.duration}) \n🚀 Skills: \${job.skills.join(", ")}\`
    );
  })`,
};
