import CodeSnippet from "@/components/code-snippet";
import { Icons } from "@/components/icons";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import Pager from "@/components/pager";
import { Badge } from "@/components/ui/badge";
import { code } from "@/config/codeContent";
import { mySkills } from "@/constants";

const SkillsToolsPage = () => {
  return (
    <>
      <PageHeader>
        <PageHeaderHeading>Skills & Tools</PageHeaderHeading>
        <PageHeaderHeading className="mt-2 text-muted-foreground">
          Learned by coding all night and debugging all day!
        </PageHeaderHeading>
        <PageHeaderDescription>
          As a full-stack Software Engineer, I specialize in building scalable
          web applications using modern technologies such as Next.js, React, and
          Tailwind CSS. I'm also expanding my expertise into mobile development
          with React Native and Expo to create cross-platform solutions.
        </PageHeaderDescription>
      </PageHeader>

      {/* skills and tools badges */}

      <div
        id="badges"
        className="flex flex-wrap items-center justify-center gap-2 my-4"
      >
        {mySkills.map((item) => (
          <Badge
            key={item.title}
            className="p-4 py-2 border border-secondary bg-secondary-foreground"
          >
            {Icons[item.icon as keyof typeof Icons]?.({
              className: "mr-2 size-4",
            })}
            {item.title}
          </Badge>
        ))}
      </div>

      <CodeSnippet title="skills.ts" code={code.skillsTools} />

      <Pager
        prevHref="/projects"
        nextHref="/experience"
        prevTitle="Projects"
        nextTitle="Experience"
      />
    </>
  );
};
export default SkillsToolsPage;
