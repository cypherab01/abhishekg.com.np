import Pager from "@/components/pager";

const ProjectsPage = () => {
  return (
    <div>
      Projects Page
      <Pager
        prevHref="/about"
        nextHref="/skills-tools"
        prevTitle="Previous"
        nextTitle="Next"
      />
    </div>
  );
};
export default ProjectsPage;
