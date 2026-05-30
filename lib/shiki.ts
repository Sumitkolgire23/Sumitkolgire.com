import { createHighlighter, Highlighter } from "shiki";

let highlighterPromise: Promise<Highlighter> | null = null;

export function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["github-dark-dimmed"],
      langs: [
        "typescript",
        "javascript",
        "css",
        "html",
        "json",
        "python",
        "rust",
        "go",
        "bash",
        "sh",
      ],
    });
  }
  return highlighterPromise;
}

export async function highlight(code: string, lang: string): Promise<string> {
  const hl = await getHighlighter();
  try {
    return hl.codeToHtml(code, {
      lang,
      theme: "github-dark-dimmed",
    });
  } catch (err) {
    // Fallback if language is not supported or highlighter fails
    try {
      return hl.codeToHtml(code, {
        lang: "txt",
        theme: "github-dark-dimmed",
      });
    } catch {
      return `<pre><code>${code}</code></pre>`;
    }
  }
}
export default highlight;
