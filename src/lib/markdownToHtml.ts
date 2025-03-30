import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import hljs from "highlight.js";

export default async function markdownToHtml(markdown: string) {
  try {
    const result = await remark()
      .use(remarkGfm)
      .use(remarkRehype)
      .use(rehypeHighlight)
      .use(rehypeStringify)
      .process(markdown);

    console.log(result);
    return result.toString();
  } catch (error) {
    console.error("Error processing markdown:", error);
    throw error;
  }
}
