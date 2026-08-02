import Avatar from '@/app/_components/avatar';
import CoverImage from '@/app/_components/cover-image';
import { type Author } from '@/interfaces/author';
import Link from 'next/link';
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

export function HeroPost({
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
        <section className="mb-20 md:mb-28">
            <div className="mb-6 flex items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-[1.5px] text-accent">
                    Latest post
                </span>
                <span className="h-px flex-1 bg-line" aria-hidden />
            </div>

            <article className="grid gap-8 rounded-3xl border border-line bg-card p-5 shadow-card transition-colors hover:bg-card-hover md:p-7 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-12">
                <CoverImage
                    title={title}
                    src={coverImage}
                    slug={slug}
                    priority
                    className="aspect-[16/9]"
                />

                <div>
                    <h2 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl lg:text-[2.1rem]">
                        <Link
                            href={`/posts/${slug}`}
                            className="decoration-accent decoration-2 underline-offset-4 hover:underline"
                        >
                            {title}
                        </Link>
                    </h2>

                    <PostMeta date={date} minutes={minutes} className="mt-3" />

                    <p className="mt-4 text-body-sm text-fg-muted">{excerpt}</p>

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
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
        </section>
    );
}
