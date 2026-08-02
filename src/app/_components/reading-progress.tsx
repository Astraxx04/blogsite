'use client';

import { useEffect, useState } from 'react';

/** Thin gradient bar under the header showing how far into the post you are. */
export function ReadingProgress() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const update = () => {
            const scrollable =
                document.documentElement.scrollHeight - window.innerHeight;
            setProgress(
                scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0
            );
        };

        update();
        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);
        return () => {
            window.removeEventListener('scroll', update);
            window.removeEventListener('resize', update);
        };
    }, []);

    return (
        <div
            className="fixed left-0 top-16 z-40 h-[3px] w-full bg-transparent"
            aria-hidden
        >
            <div
                className="h-full bg-brand-gradient transition-[width] duration-100 ease-out"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}

export default ReadingProgress;
