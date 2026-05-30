import { NextResponse } from "next/server";
import { getArticles, getPerspectives, getProjects, getDocs, urlSlug } from "@/lib/velite";

export async function GET() {
  const articles = getArticles();
  const perspectives = getPerspectives();
  const projects = getProjects();
  const docs = getDocs();

  const nodes: any[] = [];
  const links: any[] = [];
  const tagSet = new Set<string>();

  // Add Articles
  articles.forEach((item) => {
    const id = `article:${urlSlug(item.slug)}`;
    nodes.push({
      id,
      label: item.title,
      type: "article",
      url: `/articles/${urlSlug(item.slug)}`,
      description: item.description || "",
      tags: item.tags || [],
      date: item.date || "",
    });
    if (item.tags) {
      item.tags.forEach((t: string) => {
        tagSet.add(t);
        links.push({ source: id, target: `tag:${t}` });
      });
    }
  });

  // Add Perspectives
  perspectives.forEach((item) => {
    const id = `perspective:${urlSlug(item.slug)}`;
    nodes.push({
      id,
      label: item.title,
      type: "perspective",
      url: `/perspectives/${urlSlug(item.slug)}`,
      description: item.description || "",
      tags: item.tags || [],
      date: item.date || "",
    });
    if (item.tags) {
      item.tags.forEach((t: string) => {
        tagSet.add(t);
        links.push({ source: id, target: `tag:${t}` });
      });
    }
  });

  // Add Projects
  projects.forEach((item) => {
    const id = `project:${urlSlug(item.slug)}`;
    nodes.push({
      id,
      label: item.title,
      type: "project",
      url: `/projects/${urlSlug(item.slug)}`,
      description: item.description || "",
      tags: item.tags || [],
      date: item.date || "",
    });
    if (item.tags) {
      item.tags.forEach((t: string) => {
        tagSet.add(t);
        links.push({ source: id, target: `tag:${t}` });
      });
    }
  });

  // Add Docs
  docs.forEach((item) => {
    const id = `doc:${urlSlug(item.slug)}`;
    nodes.push({
      id,
      label: item.title,
      type: "doc",
      url: `/docs/${urlSlug(item.slug)}`,
      description: item.description || "",
      tags: item.tags || [],
      date: item.date || "",
    });
    if (item.tags) {
      item.tags.forEach((t: string) => {
        tagSet.add(t);
        links.push({ source: id, target: `tag:${t}` });
      });
    }
  });

  // Add Tags as nodes
  tagSet.forEach((tag) => {
    nodes.push({
      id: `tag:${tag}`,
      label: `#${tag}`,
      type: "tag",
      url: `/tags/${tag}`,
      description: `Posts and projects tagged with #${tag}`,
      tags: [],
      date: "",
    });
  });

  return NextResponse.json({ nodes, links });
}
