/** Absolute base for feeds, sitemap, canonical tags and OG images.
 *  Override per-environment with NEXT_PUBLIC_SITE_URL (no trailing slash). */
export const SITE_URL = (
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://blog.sgagan.dev'
).replace(/\/$/, '');

export const SITE_NAME = 'Insights Repo';

export const SITE_DESCRIPTION =
    "A developer's take on building, breaking, and learning through code.";

export const AUTHOR = {
    name: 'Gagan S',
    url: 'https://sgagan.dev',
    email: 'gagan200254@gmail.com',
};

/** Turns a site-relative asset path into an absolute URL. */
export function absoluteUrl(path: string) {
    return path.startsWith('http') ? path : `${SITE_URL}${path}`;
}
