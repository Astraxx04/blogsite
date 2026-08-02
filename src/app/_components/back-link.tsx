'use client';

import { useRouter } from 'next/navigation';

/** Steps back through history when there is one, else lands on the index. */
export function BackLink() {
    const router = useRouter();

    const goBack = () => {
        if (window.history.length > 1) router.back();
        else router.push('/');
    };

    return (
        <button
            onClick={goBack}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-3.5 py-1.5 text-sm font-medium text-fg-muted transition-colors hover:border-brand-rose hover:text-fg"
        >
            <span aria-hidden>←</span>
            Back
        </button>
    );
}

export default BackLink;
