import { NextResponse } from "next/server";

export const revalidate = 300; // Cache this endpoint for 5 minutes (300 seconds)

export async function GET() {
  try {
    const headers: Record<string, string> = {
      "User-Agent": "SumitKolgire-Lab-Website",
      "Accept": "application/vnd.github.v3+json",
    };

    if (process.env.GITHUB_TOKEN) {
      headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch(
      "https://api.github.com/repos/Sumitkolgire23/Sumitkolgire.com/commits?per_page=5",
      { headers }
    );

    if (!response.ok) {
      console.warn(`[GitHub API] Failed to fetch commits: ${response.status} ${response.statusText}`);
      return NextResponse.json(getFallbackCommits());
    }

    const data = await response.json();
    
    if (!Array.isArray(data)) {
      return NextResponse.json(getFallbackCommits());
    }

    const commits = data.map((item: any) => ({
      sha: item.sha,
      message: item.commit.message.split("\n")[0], // Keep only first line of commit message
      date: item.commit.author.date,
      author: {
        name: item.commit.author.name,
        avatar: item.author?.avatar_url || "https://github.com/Sumitkolgire23.png",
        username: item.author?.login || item.commit.author.name,
      },
      url: item.html_url,
    }));

    return NextResponse.json(commits);
  } catch (err) {
    console.error("[GitHub Commits API Error]", err);
    return NextResponse.json(getFallbackCommits());
  }
}

function getFallbackCommits() {
  return [
    {
      sha: "f2efe9a",
      message: "wabi: dynamic KnowledgeGraph node visualizations implemented",
      date: new Date().toISOString(),
      author: {
        name: "Sumit Kolgire",
        avatar: "https://github.com/Sumitkolgire23.png",
        username: "Sumitkolgire23",
      },
      url: "https://github.com/Sumitkolgire23/Sumitkolgire.com",
    },
    {
      sha: "0d0d0e1",
      message: "ai: setup Xenova transformers with local 384d vector similarity fallback",
      date: new Date(Date.now() - 3600000 * 4).toISOString(),
      author: {
        name: "Sumit Kolgire",
        avatar: "https://github.com/Sumitkolgire23.png",
        username: "Sumitkolgire23",
      },
      url: "https://github.com/Sumitkolgire23/Sumitkolgire.com",
    },
  ];
}
