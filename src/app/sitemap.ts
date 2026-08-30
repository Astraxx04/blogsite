import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/api';
import { SITE_URL } from '@/lib/site';
import { getAllTags } from '@/lib/tags';

export default function sitemap(): MetadataRoute.Sitemap {
    const posts = getAllPosts();
    const tags = getAllTags();

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
        ...(tags.length
            ? [
                  {
                      url: `${SITE_URL}/tags`,
                      lastModified: posts[0]
                          ? new Date(posts[0].date)
                          : new Date(),
                      changeFrequency: 'weekly' as const,
                      priority: 0.5,
                  },
              ]
            : []),
        ...tags.map((tag) => ({
            url: `${SITE_URL}/tags/${tag.slug}`,
            lastModified: posts[0] ? new Date(posts[0].date) : new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.5,
        })),
    ];
}
