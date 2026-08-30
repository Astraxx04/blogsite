import Link from 'next/link';
import CoverImage from './cover-image';
import PostMeta from './post-meta';
import TagList from './tag-list';

type Props = {
    title: string;
    postKey: string;
    coverImage: string;
    date: string;
    excerpt: string;
    slug: string;
    tags?: string[];
    minutes?: number;
};

export function PostPreview({
    title,
    postKey,
    coverImage,
    date,
    excerpt,
    slug,
    tags = [],
    minutes,
}: Props) {
    return (
        <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-card p-4 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-line-strong hover:bg-card-hover hover:shadow-lift">
            <CoverImage
                slug={slug}
                title={title}
                src={coverImage}
                className="aspect-[16/9]"
            />

            <div className="flex flex-1 flex-col px-1 pt-5">
                <h3 className="text-xl font-bold leading-snug tracking-tight sm:text-[1.375rem]">
                    <Link
                        href={`/posts/${slug}`}
                        className="decoration-accent decoration-2 underline-offset-4 hover:underline"
                    >
                        {title}
                    </Link>
                </h3>

                <PostMeta
                    date={date}
                    minutes={minutes}
                    postKey={postKey}
                    className="mt-2.5"
                />

                {/* Clamped so a long excerpt cannot stretch one card in the grid. */}
                <p className="mt-3 line-clamp-4 text-body-sm text-fg-muted">
                    {excerpt}
                </p>

                {/* Pinned to the bottom with mt-auto so the tag rows line up
                    across a grid of cards with different excerpt lengths.
                    Capped at three for the same reason. */}
                <TagList tags={tags} max={3} className="mt-auto pt-5" />
            </div>
        </article>
    );
}
