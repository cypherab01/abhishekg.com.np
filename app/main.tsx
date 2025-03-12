import Image from "next/image";
import React from "react";
import heroImage from "@/public/abhishek-ghimire.jpg";

const Hero = async () => {
  // promise of 2 seconds
  await new Promise((resolve) => setTimeout(resolve, 5000));

  return (
    <>
      <div className="container mx-auto">
        <div className="sm:flex sm:gap-8">
          <div className="float-left w-[180px] sm:w-auto mr-4 mb-4 sm:float-none sm:mr-0">
            <Image
              src={heroImage}
              alt="abhishek-ghimire"
              height={300}
              className="w-full h-auto rounded-sm"
            />
          </div>
          <div className="w-full text-justify">
            <p>
              I&apos;m Abhishek Ghimire, a computer science student with a deep
              passion for technology. I&apos;ve built a solid foundation in
              computer systems, networks, and software, and I&apos;m proficient
              in programming languages like JavaScript, HTML/CSS, along with
              frameworks like React and Next.js.
            </p>
            <p className="pt-4">
              I&apos;m always excited to dive deeper into new areas, including
              cybersecurity, and continuously push myself to stay ahead of the
              curve in an ever-evolving tech landscape. Technology has the power
              to solve real-world problems and improve business processes, and
              I&apos;m driven by the opportunity to contribute to projects that
              make a difference. Whether I&apos;m working on software
              development or exploring new tools, I&apos;m eager to learn, grow,
              and make a meaningful impact in the world of tech.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
