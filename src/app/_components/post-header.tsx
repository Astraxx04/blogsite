import CoverImage from './cover-image';
import PostMeta from './post-meta';
import { PostTitle } from '@/app/_components/post-title';
import BackLink from './back-link';
import TagList from './tag-list';

type Props = {
    title: string;
    coverImage: string;
    date: string;
    postKey: string;
    excerpt?: string;
    tags?: string[];
    minutes?: number;
};

export function PostHeader({
    title,
    coverImage,
    date,
    excerpt,
    tags = [],
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

                {/* No byline — single-author blog. The read count is left to
                    the analytics widget in the post footer. */}
                <PostMeta
                    date={date}
                    minutes={minutes}
                    className="mt-7 border-t border-line pt-5"
                />

                <TagList tags={tags} size="md" className="mt-4" />
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
