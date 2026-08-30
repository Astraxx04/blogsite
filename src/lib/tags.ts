import { Post } from '@/interfaces/post';
import { getAllPosts } from './api';

export type Tag = {
    /** Display spelling, taken from the first post that used the tag. */
    name: string;
    slug: string;
    count: number;
};

/** URL form of a tag: lowercase, non-alphanumerics collapsed to single dashes.
 *  "Self Hosting", "self-hosting" and "SELF/HOSTING" all resolve to the same
 *  page, so a typo in casing never splits a tag in two. */
export function tagSlug(tag: string) {
    return tag
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

/** Tags on a post, de-duplicated and stripped of blanks. */
export function postTags(post: Post): string[] {
    const raw = Array.isArray(post.tags) ? post.tags : [];
    const seen = new Set<string>();

    return raw.filter((tag) => {
        const slug = tagSlug(tag);
        if (!slug || seen.has(slug)) return false;
        seen.add(slug);
        return true;
    });
}

/** Every tag in use, most-used first, then alphabetical. */
export function getAllTags(): Tag[] {
    const bySlug = new Map<string, Tag>();

    for (const post of getAllPosts()) {
        for (const tag of postTags(post)) {
            const slug = tagSlug(tag);
            const existing = bySlug.get(slug);

            if (existing) existing.count += 1;
            else bySlug.set(slug, { name: tag.trim(), slug, count: 1 });
        }
    }

    return [...bySlug.values()].sort(
        (a, b) => b.count - a.count || a.name.localeCompare(b.name),
    );
}

/** Posts carrying a tag, newest first (getAllPosts is already sorted). */
export function getPostsByTag(slug: string): Post[] {
    return getAllPosts().filter((post) =>
        postTags(post).some((tag) => tagSlug(tag) === slug),
    );
}

/** Display spelling for a slug, or undefined when the tag is unused. */
export function getTagName(slug: string): string | undefined {
    return getAllTags().find((tag) => tag.slug === slug)?.name;
}
