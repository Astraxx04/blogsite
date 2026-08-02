import Avatar from './avatar';
import CoverImage from './cover-image';
import PostMeta from './post-meta';
import { PostTitle } from '@/app/_components/post-title';
import { type Author } from '@/interfaces/author';
import BackLink from './back-link';

type Props = {
    title: string;
    coverImage: string;
    date: string;
    author: Author;
    postKey: string;
    excerpt?: string;
    minutes?: number;
};

export function PostHeader({
    title,
    coverImage,
    date,
    author,
    excerpt,
    minutes,
}: Props) {
    return (
        <header className="pt-10 md:pt-14">
            {/* Title block keeps the reading measure so the eye starts in the
                same column the body text will continue in. */}
            <div className="mx-auto max-w-reading">
                <BackLink />

                <div className="mt-6">
                    <PostTitle>{title}</PostTitle>
                </div>

                {excerpt ? (
                    <p className="mt-5 font-serif text-body-sm text-fg-muted">
                        {excerpt}
                    </p>
                ) : null}

                <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-line pt-5">
                    <Avatar name={author.name} picture={author.picture} />
                    <PostMeta date={date} minutes={minutes} />
                </div>
            </div>

            {/* Cover shares the reading measure so every block on the page —
                title, prose, code, media — lines up on the same two edges. */}
            <div className="mx-auto mt-10 max-w-reading md:mt-12">
                <CoverImage
                    title={title}
                    src={coverImage}
                    priority
                    className="aspect-[16/9]"
                />
            </div>
        </header>
    );
}
