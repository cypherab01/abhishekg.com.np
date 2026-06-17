import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { ExperienceSection } from "@/components/sections/experience";
import { ProjectsSection } from "@/components/sections/projects";
import { EducationSection } from "@/components/sections/education";
import { SkillsSection } from "@/components/sections/skills";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6">
        <Hero />
        <Separator />
        <ExperienceSection />
        <Separator />
        <ProjectsSection />
        <Separator />
        <EducationSection />
        <Separator />
        <SkillsSection />
      </main>
      <Footer />
    </>
  );
}
