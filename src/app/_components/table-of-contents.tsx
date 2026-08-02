'use client';

import { useEffect, useState } from 'react';
import type { Heading } from '@/lib/toc';

type Props = {
    headings: Heading[];
};

/** Sticky section list for the right gutter. Highlights whichever heading the
 *  reader is currently under. */
export function TableOfContents({ headings }: Props) {
    const [activeId, setActiveId] = useState<string>(headings[0]?.id ?? '');

    useEffect(() => {
        if (!headings.length) return;

        const nodes = headings
            .map((heading) => document.getElementById(heading.id))
            .filter((node): node is HTMLElement => Boolean(node));

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort(
                        (a, b) =>
                            a.boundingClientRect.top - b.boundingClientRect.top
                    );

                if (visible[0]) setActiveId(visible[0].target.id);
            },
            /* Band just below the sticky header: a heading counts as "current"
               from the moment it reaches the top of the viewport. */
            { rootMargin: '-96px 0px -70% 0px', threshold: 0 }
        );

        nodes.forEach((node) => observer.observe(node));
        return () => observer.disconnect();
    }, [headings]);

    if (headings.length < 3) return null;

    return (
        <nav aria-label="On this page" className="text-sm">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[1.2px] text-fg-subtle">
                On this page
            </p>
            <ul className="space-y-1 border-l border-line">
                {headings.map((heading) => (
                    <li key={heading.id}>
                        <a
                            href={`#${heading.id}`}
                            className={`-ml-px block border-l py-1 pr-2 leading-snug transition-colors ${
                                heading.level === 3 ? 'pl-6' : 'pl-3'
                            } ${
                                activeId === heading.id
                                    ? 'border-accent font-semibold text-fg'
                                    : 'border-transparent text-fg-subtle hover:text-fg'
                            }`}
                        >
                            {heading.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default TableOfContents;
