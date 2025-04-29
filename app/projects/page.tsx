import CodeSnippet from "@/components/code-snippet";
import { PageHeader } from "@/components/page-header";
import { PageHeaderHeading } from "@/components/page-header";
import Pager from "@/components/pager";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { code } from "@/config/codeContent";
import { siteConfig } from "@/config/site";
import Link from "next/link";
import { projects } from "./projects";

const ProjectsPage = () => {
  return (
    <>
      <PageHeader className="mb-10">
        <PageHeaderHeading>Projects</PageHeaderHeading>
        <PageHeaderHeading className="mt-2 text-muted-foreground">
          A lot of ideas, but some are still under construction!
        </PageHeaderHeading>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 card-container">
        {projects.map((project, index) => (
          <Card
            key={index}
            className="relative w-full transition-all duration-300 cursor-pointer isolate hover:scale-105"
          >
            <CardHeader>
              <CardTitle>{project.title}</CardTitle>
              <CardDescription className="flex flex-col gap-2">
                {project.description}
                <Link
                  href={`/projects/${project.slug}`}
                  className="text-muted-foreground "
                >
                  Read More
                  <span className="absolute inset-0 bg-red-500/20"></span>
                </Link>
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <CodeSnippet code={code.projects} title="projects.ts" />

      <Pager
        prevHref="/about"
        nextHref="/skills-tools"
        prevTitle="About"
        nextTitle="Skills & Tools"
      />
    </>
  );
};
export default ProjectsPage;
