import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sumitkolgire.com";

/**
 * Dynamic sitemap — includes all static and Velite-generated content routes.
 * Next.js serialises this to /sitemap.xml automatically.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/articles`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/projects`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/perspectives`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/docs`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/resources`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/graph`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  // Attempt to add dynamic article/project/perspective slugs from Velite
  let dynamicRoutes: MetadataRoute.Sitemap = [];
  try {
    const { articles, projects, perspectives } = await import("#site/content");

    const articleRoutes = (articles ?? []).map((a: { slug: string; date?: string }) => ({
      url: `${BASE_URL}/articles/${a.slug}`,
      lastModified: a.date ? new Date(a.date) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    const projectRoutes = (projects ?? []).map((p: { slug: string }) => ({
      url: `${BASE_URL}/projects/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    const perspectiveRoutes = (perspectives ?? []).map((p: { slug: string; date?: string }) => ({
      url: `${BASE_URL}/perspectives/${p.slug}`,
      lastModified: p.date ? new Date(p.date) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

    dynamicRoutes = [...articleRoutes, ...projectRoutes, ...perspectiveRoutes];
  } catch {
    // Velite content not available — return static routes only
    console.warn("[sitemap] Could not import Velite content, serving static routes only");
  }

  return [...staticRoutes, ...dynamicRoutes];
}
