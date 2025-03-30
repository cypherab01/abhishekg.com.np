import CodeSnippet from "@/components/code-snippet";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import Pager from "@/components/pager";
import { code } from "@/config/codeContent";

const AboutMePage = () => {
  return (
    <>
      <PageHeader>
        <PageHeaderHeading>About Abhishek</PageHeaderHeading>
        <PageHeaderDescription>
          I am a passionate Software Engineer with a knack for building
          full-stack web applications using modern technologies like Next.js and
          Tailwind CSS. My journey in tech began with a curiosity for solving
          real-world problems through innovative solutions, which evolved into a
          love for crafting user-centric digital experiences.
        </PageHeaderDescription>

        <PageHeaderDescription>
          With a strong foundation in JavaScript frameworks, I focus on creating
          scalable, efficient, and visually appealing applications. Currently, I
          am diving deeper into mobile development with React Native and Expo to
          expand my skill set and deliver versatile, cross-platform solutions.
        </PageHeaderDescription>

        <PageHeaderDescription>
          Beyond coding, I thrive in collaborative environments and enjoy
          tackling challenging problems with creative solutions. I aim to
          contribute to impactful projects that make a difference in users'
          lives.
        </PageHeaderDescription>
      </PageHeader>

      <CodeSnippet title="aboutMe.ts" code={code.aboutMe} />

      <Pager
        prevHref="/"
        nextHref="/projects"
        prevTitle="Introduction"
        nextTitle="Projects"
      />
    </>
  );
};
export default AboutMePage;
