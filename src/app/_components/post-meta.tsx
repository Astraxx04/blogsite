import DateFormatter from './date-formatter';

type Props = {
    date: string;
    minutes?: number;
    className?: string;
};

/** Date · reading time, in one quiet line. */
export function PostMeta({ date, minutes, className = '' }: Props) {
    return (
        <div
            className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-fg-subtle ${className}`}
        >
            <DateFormatter dateString={date} />
            {minutes ? (
                <>
                    <span aria-hidden>·</span>
                    <span>{minutes} min read</span>
                </>
            ) : null}
        </div>
    );
}

export default PostMeta;
