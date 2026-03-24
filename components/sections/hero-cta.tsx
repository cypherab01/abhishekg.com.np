"use client";

import { Mail } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import { personalInfo } from "@/lib/data";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HeroCta() {
  return (
    <div className="flex gap-3">
      <a
        href={personalInfo.github}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(buttonVariants({ variant: "outline" }))}
      >
        <GithubIcon className="size-4 mr-2" />
        GitHub
      </a>
      <a
        href={`mailto:${personalInfo.email}`}
        className={cn(buttonVariants({ variant: "default" }))}
      >
        <Mail className="size-4 mr-2" />
        Get in Touch
      </a>
    </div>
  );
}
