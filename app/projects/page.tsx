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
import { siteConfig } from "@/config/site";
import Link from "next/link";

const ProjectsPage = () => {
  return (
    <>
      <PageHeader className="mb-10">
        <PageHeaderHeading>Projects</PageHeaderHeading>
        <PageHeaderHeading className="mt-2 text-muted-foreground">
          A lot of ideas, but some are still under construction!
        </PageHeaderHeading>
      </PageHeader>

      <div className="flex flex-wrap gap-4 card-container">
        {Object.entries(siteConfig.projects).map(([key, project]) => (
          <Card key={key} className="w-full max-w-[350px]  gap-2">
            <CardHeader>
              <CardTitle className="leading-6">{project.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <CardDescription>{project.description}</CardDescription>
              <CardDescription>
                <div className="flex gap-2">
                  {"live" in project && (
                    <Link href={project.live} target="_blank">
                      <Badge variant="default">Live</Badge>
                    </Link>
                  )}
                  {"github" in project && (
                    <Link href={project.github} target="_blank">
                      <Badge variant="outline">GitHub</Badge>
                    </Link>
                  )}
                  {!("live" in project) && !("github" in project) && (
                    <Badge variant="outline">Private</Badge>
                  )}
                </div>
              </CardDescription>
            </CardContent>
            <div className="my-2 border-t border-border" />
            <CardFooter className="py-0">
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

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
