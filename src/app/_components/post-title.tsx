import { ReactNode } from 'react';

type Props = {
    children?: ReactNode;
};

export function PostTitle({ children }: Props) {
    return (
        <h1 className="text-3xl font-bold leading-[1.12] tracking-tighter sm:text-4xl md:text-[2.9rem]">
            {children}
        </h1>
    );
}
