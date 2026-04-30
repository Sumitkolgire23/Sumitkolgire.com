import { articles, perspectives, projects, docs } from "#site/content";

// s.path() returns "articles/my-slug" — strip the prefix for URL routing
function urlSlug(pathSlug: string) {
  return pathSlug.split("/").pop() ?? pathSlug;
}

/**
 * Filter published content only
 */
function isPublished<T extends { status: string }>(item: T) {
  return process.env.NODE_ENV === "development" || item.status === "published";
}

/**
 * Sort by date descending
 */
function sortDesc<T extends { date: string }>(a: T, b: T) {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}

// ── ARTICLES ───────────────────────────────────────────────────

export function getArticles() {
  return articles.filter(isPublished).sort(sortDesc);
}

export function getArticleBySlug(slug: string) {
  return getArticles().find((a) => urlSlug(a.slug) === slug);
}

export function getFeaturedArticles() {
  return getArticles().filter((a) => a.featured);
}

export function getRelatedArticles(slug: string, tags: string[], limit = 3) {
  return getArticles()
    .filter((a) => a.slug !== slug && a.tags.some((t) => tags.includes(t)))
    .slice(0, limit);
}


// ── PERSPECTIVES ───────────────────────────────────────────────

export function getPerspectives() {
  return perspectives.filter(isPublished).sort(sortDesc);
}

export function getPerspectiveBySlug(slug: string) {
  return getPerspectives().find((p) => urlSlug(p.slug) === slug);
}

export function getFeaturedPerspectives() {
  return getPerspectives().filter((p) => p.featured);
}

// ── PROJECTS ───────────────────────────────────────────────────

export function getProjects() {
  return projects.filter(isPublished).sort(sortDesc);
}

export function getProjectBySlug(slug: string) {
  return getProjects().find((p) => urlSlug(p.slug) === slug);
}

// ── DOCS ───────────────────────────────────────────────────────

export function getDocs() {
  return docs.filter(isPublished).sort(sortDesc);
}

export function getDocBySlug(slug: string) {
  return getDocs().find((d) => urlSlug(d.slug) === slug);
}

/** Returns the URL-safe last segment of a Velite s.path() slug */
export { urlSlug };

// ── TAGS ───────────────────────────────────────────────────────

export function getAllTags() {
  const allTags = new Set<string>();
  
  getArticles().forEach(a => a.tags.forEach(t => allTags.add(t)));
  getPerspectives().forEach(p => p.tags.forEach(t => allTags.add(t)));
  getProjects().forEach(p => p.tags.forEach(t => allTags.add(t)));
  getDocs().forEach(d => d.tags.forEach(t => allTags.add(t)));
  
  return Array.from(allTags).sort();
}

export function getContentByTag(tag: string) {
  return {
    articles: getArticles().filter(a => a.tags.includes(tag)),
    perspectives: getPerspectives().filter(p => p.tags.includes(tag)),
    projects: getProjects().filter(p => p.tags.includes(tag)),
    docs: getDocs().filter(d => d.tags.includes(tag)),
  };
}
