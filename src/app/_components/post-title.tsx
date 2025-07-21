"use client";

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
    children?: ReactNode;
};

export function PostTitle({ children }: Props) {
    const router = useRouter();

    const goBack = () => {
        router.back();
    };

    return (
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-tight md:leading-none mb-12 text-center md:text-left lg:mx-32">
            <button
                onClick={goBack}
                className="mb-4 flex items-center justify-center w-10 h-10 rounded-full border-2 border-gray-400 text-lg md:text-xl hover:border-gray-600 hover:text-gray-600 transition-colors"
                aria-label="Go Back"
            >
                ←
            </button>
            {children}
        </h1>
    );
}
