import { Metadata } from 'next';
import Link from 'next/link';
import Container from '@/app/_components/container';
import BackLink from '@/app/_components/back-link';
import { getAllTags } from '@/lib/tags';
import { SITE_NAME } from '@/lib/site';

export const metadata: Metadata = {
    title: 'Tags',
    description: `Every topic covered on ${SITE_NAME}.`,
    alternates: { canonical: '/tags' },
};

export default function TagsIndex() {
    const tags = getAllTags();

    return (
        <main id="content">
            <Container>
                <div className="mx-auto max-w-reading pt-10 md:pt-14">
                    <BackLink />

                    <h1 className="mt-6 text-4xl font-bold tracking-tighter md:text-5xl">
                        Tags
                    </h1>
                    <p className="mt-4 text-body-sm text-fg-muted">
                        {tags.length} {tags.length === 1 ? 'topic' : 'topics'}{' '}
                        across the archive.
                    </p>

                    {tags.length > 0 ? (
                        <ul className="mt-10 flex flex-wrap gap-3 border-t border-line pt-8">
                            {tags.map((tag) => (
                                <li key={tag.slug}>
                                    <Link
                                        href={`/tags/${tag.slug}`}
                                        className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-4 py-2 text-sm font-medium text-fg-muted transition-colors hover:border-brand-rose hover:bg-card-hover hover:text-fg"
                                    >
                                        {tag.name}
                                        <span className="text-xs text-fg-subtle">
                                            {tag.count}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="mt-10 border-t border-line pt-8 text-body-sm text-fg-subtle">
                            No tags yet.
                        </p>
                    )}
                </div>

                <div className="pb-24" />
            </Container>
        </main>
    );
}
