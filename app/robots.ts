import type { MetadataRoute } from "next";

/**
 * robots.ts — served as /robots.txt by Next.js.
 * Allows all crawlers on public content; disallows private lab routes.
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sumitkolgire.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/lab", "/studio", "/api/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
