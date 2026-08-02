import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug } from '@/lib/api';
import markdownToHtml from '@/lib/markdownToHtml';
import { readingTime } from '@/lib/reading-time';
import { extractHeadings } from '@/lib/toc';
import { AUTHOR, SITE_NAME, SITE_URL, absoluteUrl } from '@/lib/site';
import Alert from '@/app/_components/alert';
import CodeCopy from '@/app/_components/code-copy';
import Container from '@/app/_components/container';
import Likes from '@/app/_components/likes';
import PostNav from '@/app/_components/post-nav';
import ReadingProgress from '@/app/_components/reading-progress';
import TableOfContents from '@/app/_components/table-of-contents';
import { PostBody } from '@/app/_components/post-body';
import { PostHeader } from '@/app/_components/post-header';

export default async function Post(props: Params) {
    const params = await props.params;
    const post = getPostBySlug(params.slug);

    if (!post) {
        return notFound();
    }

    const content = await markdownToHtml(post.content || '');
    const headings = extractHeadings(content);

    /* Some posts open with their excerpt verbatim — showing it as a standfirst
       too would print the same sentence twice. */
    const bodyStart = (post.content || '')
        .replace(/^\s*-{3,}\s*/, '')
        .trim()
        .slice(0, 60);
    const standfirst = post.excerpt?.trim().startsWith(bodyStart)
        ? undefined
        : post.excerpt;

    /* Neighbours for the end-of-post nav. getAllPosts() is newest first. */
    const posts = getAllPosts();
    const index = posts.findIndex((p) => p.slug === post.slug);
    const next = index > 0 ? posts[index - 1] : null;
    const previous =
        index >= 0 && index < posts.length - 1 ? posts[index + 1] : null;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        image: [absoluteUrl(post.ogImage?.url ?? post.coverImage)],
        datePublished: post.date,
        dateModified: post.date,
        author: {
            '@type': 'Person',
            name: post.author.name,
            url: AUTHOR.url,
        },
        publisher: {
            '@type': 'Person',
            name: AUTHOR.name,
            url: AUTHOR.url,
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${SITE_URL}/posts/${post.slug}`,
        },
        isPartOf: {
            '@type': 'Blog',
            name: SITE_NAME,
            url: SITE_URL,
        },
    };

    return (
        <main id="content">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ReadingProgress />
            <CodeCopy />
            <Alert preview={post.preview} />
            <Container>
                {/* The table of contents floats in the right gutter so the
                    reading column stays centred on the page. */}
                <div className="relative">
                    <aside className="absolute right-0 top-0 hidden h-full w-44 pt-40 xl:block">
                        <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pb-8">
                            <TableOfContents headings={headings} />
                        </div>
                    </aside>

                    <article className="pb-8">
                        <PostHeader
                            title={post.title}
                            postKey={post.postKey}
                            coverImage={post.coverImage}
                            date={post.date}
                            author={post.author}
                            excerpt={standfirst}
                            minutes={readingTime(post.content || '')}
                        />

                        <div className="mt-12 md:mt-16">
                            <PostBody content={content} />
                        </div>

                        <footer className="mx-auto mt-16 max-w-reading border-t border-line pt-8">
                            <p className="mb-4 text-sm text-fg-subtle">
                                Was this post useful?
                            </p>
                            <Likes postKey={post.postKey} isValidPage={true} />
                        </footer>
                    </article>

                    <PostNav
                        previous={
                            previous
                                ? { title: previous.title, slug: previous.slug }
                                : null
                        }
                        next={
                            next ? { title: next.title, slug: next.slug } : null
                        }
                    />
                </div>

                <div className="pb-24" />
            </Container>
        </main>
    );
}

type Params = {
    params: Promise<{
        slug: string;
    }>;
};

export async function generateMetadata(props: Params): Promise<Metadata> {
    const params = await props.params;
    const post = getPostBySlug(params.slug);

    if (!post) {
        return notFound();
    }

    const url = `/posts/${post.slug}`;
    const image = post.ogImage?.url ?? post.coverImage;

    return {
        title: post.title,
        description: post.excerpt,
        /* Page-level `alternates` replaces the layout's, so the feed link has
           to be repeated here to stay discoverable on post pages. */
        alternates: {
            canonical: url,
            types: { 'application/rss+xml': `${SITE_URL}/feed.xml` },
        },
        openGraph: {
            type: 'article',
            title: post.title,
            description: post.excerpt,
            url,
            siteName: SITE_NAME,
            publishedTime: post.date,
            authors: [post.author.name],
            images: [image],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt,
            images: [image],
        },
    };
}

export async function generateStaticParams() {
    const posts = getAllPosts();

    return posts.map((post) => ({
        slug: post.slug,
    }));
}
