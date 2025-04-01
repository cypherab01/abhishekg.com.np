import { siteConfig } from "@/config/site";
import { NextResponse } from "next/server";

export async function GET() {
  const username = siteConfig.links.githubUsername;
  const url = `https://api.github.com/users/${username}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("GitHub API request failed");

    const data = await response.json();
    return NextResponse.json(
      {
        public_repos: data.public_repos,
        followers: data.followers,
        following: data.following,
        company: data.company,
        bio: data.bio,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
