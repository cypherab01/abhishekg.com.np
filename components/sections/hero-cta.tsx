import { Mail, FileDown } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

interface HeroCtaProps {
  github?: string | null;
  email: string;
  resumeUrl?: string | null;
}

export function HeroCta({ github, email, resumeUrl }: HeroCtaProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {github && (
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          <GithubIcon className="size-4 mr-2" />
          GitHub
        </a>
      )}
      <a
        href={`mailto:${email}`}
        className={cn(buttonVariants({ variant: "default" }))}
      >
        <Mail className="size-4 mr-2" />
        Get in Touch
      </a>
      {resumeUrl && (
        <a
          href={resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          <FileDown className="size-4 mr-2" />
          Download Resume
        </a>
      )}
    </div>
  );
}
