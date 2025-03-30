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
};
