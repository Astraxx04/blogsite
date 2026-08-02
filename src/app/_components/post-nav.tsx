import Link from 'next/link';

type Neighbour = { title: string; slug: string } | null;

type Props = {
    previous: Neighbour;
    next: Neighbour;
};

/** Previous (older) / next (newer) links at the end of a post. */
export function PostNav({ previous, next }: Props) {
    if (!previous && !next) return null;

    const card =
        'group flex flex-col gap-2 rounded-2xl border border-line bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:bg-card-hover';

    return (
        <nav className="mx-auto mt-16 grid max-w-reading gap-4 sm:grid-cols-2">
            {previous ? (
                <Link
                    href={`/posts/${previous.slug}`}
                    className={card}
                    aria-label={`Previous post: ${previous.title}`}
                >
                    <span className="text-xs font-semibold uppercase tracking-[1.2px] text-fg-subtle">
                        ← Previous
                    </span>
                    <span className="font-semibold leading-snug text-fg">
                        {previous.title}
                    </span>
                </Link>
            ) : (
                <span aria-hidden />
            )}

            {next ? (
                <Link
                    href={`/posts/${next.slug}`}
                    className={`${card} sm:text-right`}
                    aria-label={`Next post: ${next.title}`}
                >
                    <span className="text-xs font-semibold uppercase tracking-[1.2px] text-fg-subtle">
                        Next →
                    </span>
                    <span className="font-semibold leading-snug text-fg">
                        {next.title}
                    </span>
                </Link>
            ) : null}
        </nav>
    );
}

export default PostNav;
