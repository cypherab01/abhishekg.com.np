import { siteConfig } from "@/config/site";
import Link from "next/link";

// marking this as async for now
// maybe we can make this component dynamic with revalidate time in the future
export async function SiteFooter() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="py-6 border-t border-grid md:py-0">
      <div className="container-wrapper">
        <div className="container py-4">
          <div className="hidden text-sm leading-loose text-center text-balance text-muted-foreground md:block">
            Built with <span className="font-medium">Next.js</span>,{" "}
            <span className="font-medium">shadcn/ui </span>
            and <span className="font-medium">Tailwind CSS</span>. Coded in
            <span className="font-medium"> Cursor</span> and deployed with
            <span className="font-medium"> Vercel</span>. Developed by{" "}
            <Link
              href={siteConfig.links.githubProfile}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Abhishek Ghimire
            </Link>
            . Source code available on{" "}
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </Link>
            .
          </div>

          <div className="text-sm leading-loose text-center text-balance text-muted-foreground">
            © 2018 - {currentYear} Abhishek Ghimire · All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
