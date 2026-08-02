import { type Author } from '@/interfaces/author';
import Link from 'next/link';
import Avatar from './avatar';
import CoverImage from './cover-image';
import Likes from './likes';
import PostMeta from './post-meta';

type Props = {
    title: string;
    postKey: string;
    coverImage: string;
    date: string;
    excerpt: string;
    author: Author;
    slug: string;
    minutes?: number;
};

export function PostPreview({
    title,
    postKey,
    coverImage,
    date,
    excerpt,
    author,
    slug,
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

                <PostMeta date={date} minutes={minutes} className="mt-2.5" />

                {/* Clamped so a long excerpt cannot stretch one card in the grid. */}
                <p className="mt-3 line-clamp-4 text-body-sm text-fg-muted">
                    {excerpt}
                </p>

                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
                    <Avatar
                        name={author.name}
                        picture={author.picture}
                        size="sm"
                    />
                    <Likes
                        postKey={postKey}
                        isValidPage={false}
                        variant="compact"
                    />
                </div>
            </div>
        </article>
    );
}
