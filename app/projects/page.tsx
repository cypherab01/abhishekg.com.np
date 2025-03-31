import { PageHeader } from "@/components/page-header";
import { PageHeaderHeading } from "@/components/page-header";
import Pager from "@/components/pager";

const ProjectsPage = () => {
  return (
    <>
      <PageHeader className="mb-10">
        <PageHeaderHeading>Projects</PageHeaderHeading>
        <PageHeaderHeading className="mt-2 text-muted-foreground">
          A lot of ideas, but some are still under construction!
        </PageHeaderHeading>
      </PageHeader>
    </>
  );
};
export default ProjectsPage;
