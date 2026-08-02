import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeStringify from "rehype-stringify";

export default async function markdownToHtml(markdown: string) {
  try {
    const result = await remark()
      .use(remarkGfm)
      .use(remarkRehype)
      .use(rehypeHighlight)
      // Slugs feed both the table of contents and the anchor links below.
      .use(rehypeSlug)
      .use(rehypeAutolinkHeadings, {
        behavior: "append",
        properties: { className: "heading-anchor", ariaHidden: true, tabIndex: -1 },
        content: { type: "text", value: "#" },
      })
      .use(rehypeStringify)
      .process(markdown);

    return result.toString();
  } catch (error) {
    console.error("Error processing markdown:", error);
    throw error;
  }
}
