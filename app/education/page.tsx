import CodeSnippet from "@/components/code-snippet";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import Pager from "@/components/pager";
import { HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { HoverCard } from "@/components/ui/hover-card";
import { code } from "@/config/codeContent";
import { siteConfig } from "@/config/site";
import Link from "next/link";

const EducationPage = () => {
  return (
    <>
      <PageHeader className="mb-10">
        <PageHeaderHeading>Education</PageHeaderHeading>
        <PageHeaderDescription>
          Education has always been the cornerstone of my journey into the tech
          world. Pursuing a Bachelor's in Information Technology (BIT) at Patan
          Multiple Campus has provided me with a solid foundation in computer
          science and software engineering principles.
        </PageHeaderDescription>

        <PageHeaderDescription>
          My academic journey has been complemented by hands-on projects and
          coursework, enabling me to build practical skills and a deep
          understanding of modern technological solutions.
        </PageHeaderDescription>
      </PageHeader>

      <ol className="relative mb-10 border-gray-200 border-s dark:border-gray-700">
        <li className="mb-10 ms-6">
          <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
            <svg
              className="w-2.5 h-2.5 text-blue-800 dark:text-blue-300"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
            </svg>
          </span>
          <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
            Bachelors in Information Technology · Patan Multiple Campus ·
            Tribhuvan University
            <span className="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-blue-900 dark:text-blue-300 ms-3">
              Latest
            </span>
          </h3>
          <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
            Mar. 2021 - May 2025 (Expected)
          </time>
          <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
            I am pursuing a Bachelor's in IT at Patan Multiple Campus,
            specializing in programming, web development, and software
            engineering.
          </p>
          <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
            My coursework includes Data Structures, Web Technologies, and
            Software Project Management.
          </p>

          <HoverCard>
            <HoverCardTrigger className="cursor-pointer ">
              {/* <Link href={siteConfig.bitinfonepal}>
              Visit bitinfonepal.com
              </Link> */}
              @bitinfonepal.com
            </HoverCardTrigger>
            <HoverCardContent>
              <p>
                I co-created{" "}
                <Link
                  href={siteConfig.bitinfonepal}
                  className="underline cursor-pointer underline-offset-4"
                >
                  bitinfonepal.com
                </Link>
                , an exam-friendly platform for BIT students. This website helps
                students prepare for their exams by providing resources like
                notes, syllabuses, past questions, and BIT filtered notices,
                offering a comprehensive study companion.
              </p>
            </HoverCardContent>
          </HoverCard>
        </li>
        <li className="mb-10 ms-6">
          <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
            <svg
              className="w-2.5 h-2.5 text-blue-800 dark:text-blue-300"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
            </svg>
          </span>
          <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
            Physical Science · Deep Boarding High School · NEB
          </h3>
          <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
            July 2018 - Oct. 2020
          </time>
          <p className="text-base font-normal text-gray-500 dark:text-gray-400">
            I completed my higher secondary education in Physical Science from
            Deep Boarding High School, Butwal.
          </p>
        </li>
        <li className="ms-6">
          <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
            <svg
              className="w-2.5 h-2.5 text-blue-800 dark:text-blue-300"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
            </svg>
          </span>
          <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
            Secondary Education · Motherland English School · SEE
          </h3>
          <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
            Apr. 2005 - Mar. 2018
          </time>
          <p className="text-base font-normal text-gray-500 dark:text-gray-400">
            I completed my foundational education up to SEE at Motherland
            English School
          </p>
        </li>
      </ol>

      <CodeSnippet code={code.education} title="coursework.ts" />

      <Pager
        prevHref="/experience"
        nextHref="/testimonials"
        prevTitle="Experience"
        nextTitle="Testimonials"
      />
    </>
  );
};
export default EducationPage;
