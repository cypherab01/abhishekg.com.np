"use server";

import { siteConfig } from "@/config/site";

export async function getGitHubStatsServerAction() {
  try {
    const response = await fetch(
      `https://api.github.com/users/${siteConfig.links.githubUsername}`
    );
    const data = await response.json();
    return {
      name: data.name,
      bio: data.bio,
      avatar_url: data.avatar_url,
      company: data.company,
      public_repos: data.public_repos,
      followers: data.followers,
      following: data.following,
      location: data.location,
      hireable: data.hireable,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to get GitHub stats",
    };
  }
}
