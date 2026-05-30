import React from "react";
import { highlight } from "@/lib/shiki";

interface CodeBlockProps {
  children?: React.ReactNode;
}

export async function CodeBlock({ children, ...props }: CodeBlockProps) {
  // Check if children is a <code> element
  if (React.isValidElement(children) && children.type === "code") {
    const codeProps = children.props as {
      children?: string;
      className?: string;
    };
    const codeText = codeProps.children || "";
    const className = codeProps.className || "";

    // Extract language (e.g. "language-typescript" -> "typescript")
    const match = /language-(\w+)/.exec(className);
    const lang = match ? match[1] : "txt";

    // Perform highlighting using shiki on the server
    const html = await highlight(codeText, lang);

    // shiki generates a complete `<pre class="shiki ..."><code>...</code></pre>`
    // We can inject it directly.
    return (
      <div
        dangerouslySetInnerHTML={{ __html: html }}
        style={{ margin: "2rem 0" }}
      />
    );
  }

  // Fallback
  return <pre {...props}>{children}</pre>;
}
export default CodeBlock;
