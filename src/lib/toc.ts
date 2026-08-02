export type Heading = {
    id: string;
    text: string;
    level: 2 | 3;
};

/** Pulls h2/h3 anchors out of the rendered HTML, so the ids always match the
 *  ones rehype-slug produced — no second slugifier to keep in sync. */
export function extractHeadings(html: string): Heading[] {
    const headings: Heading[] = [];
    const pattern = /<h([23])\s+id="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/g;

    for (const match of html.matchAll(pattern)) {
        const text = match[3]
            // Drop the appended "#" anchor link and any inline markup.
            .replace(/<a\s[^>]*class="heading-anchor"[\s\S]*?<\/a>/g, '')
            .replace(/<[^>]+>/g, '')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#x26;/g, '&')
            .trim();

        if (text) {
            headings.push({
                id: match[2],
                text,
                level: match[1] === '2' ? 2 : 3,
            });
        }
    }

    return headings;
}
