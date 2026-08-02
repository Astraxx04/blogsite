import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/api';
import { SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
    const posts = getAllPosts();

    return [
        {
            url: SITE_URL,
            lastModified: posts[0] ? new Date(posts[0].date) : new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        ...posts.map((post) => ({
            url: `${SITE_URL}/posts/${post.slug}`,
            lastModified: new Date(post.date),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        })),
    ];
}
