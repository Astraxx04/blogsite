import Link from 'next/link';
import { tagSlug } from '@/lib/tags';

type Props = {
    tags: string[];
    /** `sm` for the density of a card, `md` for a post page. */
    size?: 'sm' | 'md';
    /** Caps how many pills render; the rest collapse into a `+n` chip. */
    max?: number;
    className?: string;
};

const SIZES = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
};

/** Pill links to the tag archives. Renders nothing for an untagged post so
 *  callers do not have to guard on an empty list. */
export function TagList({ tags, size = 'sm', max, className = '' }: Props) {
    if (!tags.length) return null;

    const shown = max ? tags.slice(0, max) : tags;
    const hidden = tags.length - shown.length;

    return (
        <ul className={`flex flex-wrap items-center gap-2 ${className}`}>
            {shown.map((tag) => (
                <li key={tag}>
                    <Link
                        href={`/tags/${tagSlug(tag)}`}
                        className={`inline-block rounded-full border border-line bg-bg-soft font-medium text-fg-muted transition-colors hover:border-brand-rose hover:text-fg ${SIZES[size]}`}
                    >
                        {tag}
                    </Link>
                </li>
            ))}

            {hidden > 0 && (
                <li
                    className={`inline-block rounded-full border border-line font-medium text-fg-subtle ${SIZES[size]}`}
                >
                    +{hidden}
                </li>
            )}
        </ul>
    );
}

export default TagList;
