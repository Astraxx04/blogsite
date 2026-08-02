import cn from 'classnames';
import Link from 'next/link';
import Image from 'next/image';

type Props = {
    title: string;
    src: string;
    slug?: string;
    priority?: boolean;
    className?: string;
};

const CoverImage = ({ title, src, slug, priority, className }: Props) => {
    const image = (
        <Image
            src={src}
            alt={`Cover image for ${title}`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            width={1200}
            height={630}
            priority={priority}
            sizes="(max-width: 768px) 100vw, 800px"
        />
    );

    const frame = (
        <div
            className={cn(
                'group relative block overflow-hidden rounded-2xl border border-line bg-bg-soft shadow-card',
                className
            )}
        >
            {image}
        </div>
    );

    return slug ? (
        <Link href={`/posts/${slug}`} aria-label={title} tabIndex={-1}>
            {frame}
        </Link>
    ) : (
        frame
    );
};

export default CoverImage;
