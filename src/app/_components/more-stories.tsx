import { Post } from '@/interfaces/post';
import { readingTime } from '@/lib/reading-time';
import { postTags } from '@/lib/tags';
import { PostPreview } from './post-preview';

type Props = {
    posts: Post[];
    /** Heading over the grid — the tag archives reuse it for their own name. */
    label?: string;
};

export function MoreStories({ posts, label = 'All posts' }: Props) {
    return (
        <section className="pb-24">
            <div className="mb-8 flex items-center gap-3">
                <h2 className="text-xs font-semibold uppercase tracking-[1.5px] text-accent">
                    {label}
                </h2>
                <span className="h-px flex-1 bg-line" aria-hidden />
                <span className="text-xs text-fg-subtle">
                    {posts.length} {posts.length === 1 ? 'post' : 'posts'}
                </span>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
                {posts.map((post) => (
                    <PostPreview
                        key={post.slug}
                        postKey={post.postKey}
                        title={post.title}
                        coverImage={post.coverImage}
                        date={post.date}
                        slug={post.slug}
                        excerpt={post.excerpt}
                        tags={postTags(post)}
                        minutes={readingTime(post.content)}
                    />
                ))}
            </div>
        </section>
    );
}
