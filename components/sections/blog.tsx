import { ChevronRight } from "lucide-react";
import { Section, type SectionTone } from "@/components/layout/section";
import { BlogShowcase } from "@/components/sections/blog-showcase";
import { Reveal } from "@/components/ui/reveal";
import { BLOG_SITE_URL, type BlogPost } from "@/lib/blog";

export function BlogSection({
  mostViewed,
  mostLiked,
  tone = "surface",
}: {
  mostViewed: BlogPost[];
  mostLiked: BlogPost[];
  tone?: SectionTone;
}) {
  if (mostViewed.length === 0 && mostLiked.length === 0) return null;

  return (
    <Section
      id="writing"
      eyebrow="Writing"
      title="Notes from the work."
      tone={tone}
      cta={
        <a href={BLOG_SITE_URL} className="link-cta">
          Read the blog
          <ChevronRight className="size-5" aria-hidden />
        </a>
      }
    >
      <Reveal>
        <BlogShowcase mostViewed={mostViewed} mostLiked={mostLiked} />
      </Reveal>
    </Section>
  );
}
