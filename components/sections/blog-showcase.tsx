"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";
import { Clock, Eye, Heart } from "lucide-react";
import type { BlogPost } from "@/lib/blog";
import { cn } from "@/lib/utils";

type Metric = "views" | "likes";

const TABS: { metric: Metric; label: string }[] = [
  { metric: "views", label: "Most read" },
  { metric: "likes", label: "Most liked" },
];

// Pinned to UTC so the server and browser render the same string.
const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

const numberFormat = new Intl.NumberFormat("en-US", { notation: "compact" });

/**
 * Popular posts, switchable between most read and most liked. The top post
 * gets a cover-image feature card; the rest form a ranked list beside it.
 */
export function BlogShowcase({
  mostViewed,
  mostLiked,
}: {
  mostViewed: BlogPost[];
  mostLiked: BlogPost[];
}) {
  const baseId = useId();
  const tabs = TABS.filter(({ metric }) =>
    (metric === "views" ? mostViewed : mostLiked).length > 0,
  );
  const [active, setActive] = useState<Metric>(tabs[0]?.metric ?? "views");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  if (tabs.length === 0) return null;

  const posts = active === "views" ? mostViewed : mostLiked;
  const [featured, ...rest] = posts;

  // Roving focus per the WAI-ARIA tabs pattern: arrows move and select.
  function onKeyDown(event: React.KeyboardEvent, index: number) {
    const last = tabs.length - 1;
    const next =
      event.key === "ArrowRight" ? (index === last ? 0 : index + 1)
      : event.key === "ArrowLeft" ? (index === 0 ? last : index - 1)
      : event.key === "Home" ? 0
      : event.key === "End" ? last
      : null;
    if (next === null) return;
    event.preventDefault();
    setActive(tabs[next].metric);
    tabRefs.current[next]?.focus();
  }

  return (
    <div>
      {tabs.length > 1 && (
        <div
          role="tablist"
          aria-label="Popular posts"
          className="mb-8 inline-flex rounded-full bg-surface-sunken p-1"
        >
          {tabs.map(({ metric, label }, i) => {
            const selected = metric === active;
            return (
              <button
                key={metric}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`${baseId}-tab-${metric}`}
                aria-selected={selected}
                aria-controls={`${baseId}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(metric)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className={cn(
                  "inline-flex h-10 items-center gap-2 rounded-full px-5 text-sm font-medium transition-colors duration-200 ease-standard focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  selected
                    ? "bg-background text-foreground shadow-elev-1"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {metric === "views" ? (
                  <Eye className="size-4" aria-hidden />
                ) : (
                  <Heart className="size-4" aria-hidden />
                )}
                {label}
              </button>
            );
          })}
        </div>
      )}

      <div
        key={active}
        id={`${baseId}-panel`}
        role={tabs.length > 1 ? "tabpanel" : undefined}
        aria-labelledby={tabs.length > 1 ? `${baseId}-tab-${active}` : undefined}
        className="grid grid-cols-1 gap-6 animate-in fade-in duration-300 motion-reduce:animate-none lg:grid-cols-12 lg:gap-10"
      >
        <FeaturedPost post={featured} metric={active} />

        {rest.length > 0 && (
          <ol className="flex flex-col divide-y divide-outline-variant lg:col-span-5">
            {rest.map((post, i) => (
              <li key={post.slug}>
                <RankedPost post={post} rank={i + 2} metric={active} />
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

function FeaturedPost({ post, metric }: { post: BlogPost; metric: Metric }) {
  return (
    <a
      href={post.href}
      className="group flex flex-col overflow-hidden rounded-3xl bg-surface-tinted transition-shadow duration-200 ease-standard hover:shadow-elev-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring lg:col-span-7"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-surface-sunken">
        <Cover post={post} sizes="(min-width: 1024px) 700px, 100vw" priority />
        <span className="absolute left-4 top-4 inline-flex h-8 items-center rounded-full bg-background/90 px-3 text-sm font-medium backdrop-blur">
          #1 {metric === "views" ? "most read" : "most liked"}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <PostEyebrow post={post} />
        <h3 className="text-card-title font-medium leading-[1.3] tracking-[-0.005em] group-hover:text-link">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-3 line-clamp-3 text-muted-foreground">
            {post.excerpt}
          </p>
        )}
        <PostStats post={post} metric={metric} className="mt-auto pt-6" />
      </div>
    </a>
  );
}

function RankedPost({
  post,
  rank,
  metric,
}: {
  post: BlogPost;
  rank: number;
  metric: Metric;
}) {
  return (
    <a
      href={post.href}
      className="group -mx-3 flex items-start gap-4 rounded-2xl px-3 py-5 transition-colors duration-200 ease-standard hover:bg-surface-tinted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <span
        className="w-8 shrink-0 pt-0.5 text-2xl font-medium tabular-nums leading-none text-subtle-foreground"
        aria-hidden
      >
        {String(rank).padStart(2, "0")}
      </span>
      <div className="min-w-0 flex-1">
        <PostEyebrow post={post} />
        <h3 className="line-clamp-2 font-medium leading-snug group-hover:text-link">
          <span className="sr-only">Rank {rank}: </span>
          {post.title}
        </h3>
        <PostStats post={post} metric={metric} className="mt-2" />
      </div>
      <div className="relative hidden size-20 shrink-0 overflow-hidden rounded-xl bg-surface-sunken sm:block">
        <Cover post={post} sizes="80px" />
      </div>
    </a>
  );
}

function Cover({
  post,
  sizes,
  priority = false,
}: {
  post: BlogPost;
  sizes: string;
  priority?: boolean;
}) {
  if (!post.coverImageUrl) {
    return (
      <div
        className="flex size-full items-center justify-center bg-accent text-3xl font-medium text-accent-foreground"
        aria-hidden
      >
        {post.title.charAt(0)}
      </div>
    );
  }
  return (
    <Image
      src={post.coverImageUrl}
      alt=""
      fill
      sizes={sizes}
      priority={priority}
      className="object-cover transition-transform duration-300 ease-standard group-hover:scale-[1.03] motion-reduce:transform-none"
    />
  );
}

function PostEyebrow({ post }: { post: BlogPost }) {
  return (
    <p className="mb-1.5 flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
      {post.category && (
        <>
          <span className="font-medium">{post.category}</span>
          <span aria-hidden>·</span>
        </>
      )}
      <time dateTime={post.publishedAt}>
        {dateFormat.format(new Date(post.publishedAt))}
      </time>
    </p>
  );
}

function PostStats({
  post,
  metric,
  className,
}: {
  post: BlogPost;
  metric: Metric;
  className?: string;
}) {
  // The metric the tab ranks by is emphasised; the others stay quiet.
  const stat = (active: boolean) =>
    cn("inline-flex items-center gap-1", active && "font-medium text-foreground");

  return (
    <p
      className={cn(
        "flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground",
        className,
      )}
    >
      <span className={stat(false)}>
        <Clock className="size-4" aria-hidden />
        {post.readingMinutes} min read
      </span>
      <span className={stat(metric === "views")}>
        <Eye className="size-4" aria-hidden />
        {numberFormat.format(post.views)}
        <span className="sr-only"> views</span>
      </span>
      <span className={stat(metric === "likes")}>
        <Heart
          className={cn("size-4", metric === "likes" && "fill-current text-[var(--gfs-danger)]")}
          aria-hidden
        />
        {numberFormat.format(post.likes)}
        <span className="sr-only"> likes</span>
      </span>
    </p>
  );
}
