import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Container from '@/app/_components/container';
import BackLink from '@/app/_components/back-link';
import { MoreStories } from '@/app/_components/more-stories';
import { getAllTags, getPostsByTag, getTagName } from '@/lib/tags';
import { SITE_NAME } from '@/lib/site';

type Params = {
    params: Promise<{ tag: string }>;
};

export default async function TagPage(props: Params) {
    const { tag } = await props.params;
    const name = getTagName(tag);
    const posts = getPostsByTag(tag);

    if (!name || posts.length === 0) {
        return notFound();
    }

    return (
        <main id="content">
            <Container>
                <div className="mx-auto max-w-reading pt-10 md:pt-14">
                    <BackLink />

                    <p className="mt-6 text-xs font-semibold uppercase tracking-[1.5px] text-accent">
                        Tagged
                    </p>
                    <h1 className="mt-2 text-4xl font-bold tracking-tighter md:text-5xl">
                        {name}
                    </h1>
                    <p className="mt-4 text-body-sm text-fg-muted">
                        {posts.length} {posts.length === 1 ? 'post' : 'posts'} ·{' '}
                        <Link
                            href="/tags"
                            className="text-link underline underline-offset-4 hover:text-link-hover"
                        >
                            browse all tags
                        </Link>
                    </p>
                </div>

                <div className="mt-12 md:mt-16">
                    <MoreStories posts={posts} label={name} />
                </div>
            </Container>
        </main>
    );
}

export async function generateMetadata(props: Params): Promise<Metadata> {
    const { tag } = await props.params;
    const name = getTagName(tag);

    if (!name) {
        return {};
    }

    const count = getPostsByTag(tag).length;
    const title = `Posts tagged “${name}”`;
    const description = `${count} ${count === 1 ? 'post' : 'posts'} tagged “${name}” on ${SITE_NAME}.`;

    return {
        title,
        description,
        alternates: { canonical: `/tags/${tag}` },
        openGraph: { type: 'website', title, description, url: `/tags/${tag}` },
        twitter: { card: 'summary', title, description },
    };
}

export async function generateStaticParams() {
    return getAllTags().map((tag) => ({ tag: tag.slug }));
}
