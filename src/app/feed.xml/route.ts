import { getAllPosts } from '@/lib/api';
import {
    AUTHOR,
    SITE_DESCRIPTION,
    SITE_NAME,
    SITE_URL,
    absoluteUrl,
} from '@/lib/site';

/** Escapes the five XML predefined entities. */
function escapeXml(value: string) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

export const dynamic = 'force-static';

export async function GET() {
    const posts = getAllPosts();
    const updated = posts[0]
        ? new Date(posts[0].date).toUTCString()
        : new Date().toUTCString();

    const items = posts
        .map((post) => {
            const url = `${SITE_URL}/posts/${post.slug}`;
            return `        <item>
            <title>${escapeXml(post.title)}</title>
            <link>${url}</link>
            <guid isPermaLink="true">${url}</guid>
            <description>${escapeXml(post.excerpt)}</description>
            <pubDate>${new Date(post.date).toUTCString()}</pubDate>
            <author>${escapeXml(`${AUTHOR.email} (${post.author.name})`)}</author>
            <enclosure url="${absoluteUrl(post.coverImage)}" type="image/png" length="0" />
        </item>`;
        })
        .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title>${escapeXml(SITE_NAME)}</title>
        <link>${SITE_URL}</link>
        <description>${escapeXml(SITE_DESCRIPTION)}</description>
        <language>en</language>
        <lastBuildDate>${updated}</lastBuildDate>
        <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items}
    </channel>
</rss>
`;

    return new Response(xml, {
        headers: {
            'Content-Type': 'application/rss+xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
    });
}
