import "server-only";

/**
 * Read-only client for the blog API (inside.abhishekg.com.np). Every call runs
 * on the server, so no CORS origin is needed. A slow or failing API must never
 * break the homepage: each helper resolves to an empty result instead of
 * throwing, and the blog section simply hides itself.
 */

const API_URL = (
  process.env.BLOG_API_URL ?? "https://insideapi.abhishekg.com.np"
).replace(/\/+$/, "");

export const BLOG_SITE_URL = (
  process.env.BLOG_SITE_URL ?? "https://inside.abhishekg.com.np"
).replace(/\/+$/, "");

/** Seconds a response is reused before the next request refetches it. */
const REVALIDATE_SECONDS = 600;
const TIMEOUT_MS = 5000;

/** The subset of the API's `PostRead` schema this site uses. */
interface ApiPost {
  title: string;
  content: string;
  cover_image_url: string;
  category_id: string;
  slug: string;
  published_at: string | null;
  created_at: string;
  view_count: number;
  like_count: number;
}

interface ApiCategory {
  id: string;
  name: string;
}

/** A post trimmed for listing: the full HTML body never reaches the client. */
export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  coverImageUrl: string | null;
  category: string | null;
  publishedAt: string;
  readingMinutes: number;
  views: number;
  likes: number;
  href: string;
}

async function getJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: REVALIDATE_SECONDS, tags: ["blog"] },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) {
      console.error(`Blog API ${path} responded ${res.status}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (error) {
    console.error(`Blog API ${path} failed`, error);
    return null;
  }
}

const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

function htmlToText(html: string): string {
  return html
    .replace(/<(script|style|pre)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&(#\d+|#x[\da-f]+|[a-z]+);/gi, (match, entity: string) => {
      if (entity[0] === "#") {
        const code =
          entity[1].toLowerCase() === "x"
            ? parseInt(entity.slice(2), 16)
            : parseInt(entity.slice(1), 10);
        return Number.isFinite(code) ? String.fromCodePoint(code) : match;
      }
      return ENTITIES[entity.toLowerCase()] ?? match;
    })
    .replace(/\s+/g, " ")
    .trim();
}

function toExcerpt(text: string, max = 180): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s.,;:—-]+$/, "")}…`;
}

function toBlogPost(post: ApiPost, categories: Map<string, string>): BlogPost {
  const text = htmlToText(post.content);
  const words = text ? text.split(" ").length : 0;
  return {
    slug: post.slug,
    title: post.title,
    excerpt: toExcerpt(text),
    coverImageUrl: post.cover_image_url || null,
    category: categories.get(post.category_id) ?? null,
    publishedAt: post.published_at ?? post.created_at,
    readingMinutes: Math.max(1, Math.round(words / 200)),
    views: post.view_count,
    likes: post.like_count,
    href: `${BLOG_SITE_URL}/posts/${encodeURIComponent(post.slug)}`,
  };
}

async function getCategoryNames(): Promise<Map<string, string>> {
  const page = await getJson<{ items: ApiCategory[] }>(
    "/categories?page_size=200",
  );
  return new Map((page?.items ?? []).map((c) => [c.id, c.name]));
}

/** Most viewed and most liked posts, fetched in parallel. */
export async function getPopularPosts(limit = 5): Promise<{
  mostViewed: BlogPost[];
  mostLiked: BlogPost[];
}> {
  const [viewed, liked, categories] = await Promise.all([
    getJson<ApiPost[]>(`/posts/most-viewed?limit=${limit}`),
    getJson<ApiPost[]>(`/posts/most-liked?limit=${limit}`),
    getCategoryNames(),
  ]);
  return {
    mostViewed: (viewed ?? []).map((p) => toBlogPost(p, categories)),
    mostLiked: (liked ?? []).map((p) => toBlogPost(p, categories)),
  };
}
