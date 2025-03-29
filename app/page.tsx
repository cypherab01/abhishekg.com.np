import { ChevronRight } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

const title = "Introduction";

export const metadata: Metadata = {
  title: title,
  description: "Introduction Page",
};

const IntroductionPage = () => {
  return (
    <>
      <div className="mb-4 flex items-center space-x-1 text-sm leading-none text-muted-foreground">
        <Link href="/" className="truncate">
          Sections
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <div className="text-foreground">{title}</div>
      </div>
      <h1 className="text-2xl font-bold">{title}</h1>
    </>
  );
};
export default IntroductionPage;
