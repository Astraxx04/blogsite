import DateFormatter from './date-formatter';
import Likes from './likes';

type Props = {
    date: string;
    minutes?: number;
    /** Supply to append the post's read count. Omitted where a full
     *  analytics widget already renders the number elsewhere on the page. */
    postKey?: string;
    className?: string;
};

/** Date · reading time · reads, in one quiet line. The blog has a single
 *  author, so this line carries the whole byline — no avatar, no name. */
export function PostMeta({ date, minutes, postKey, className = '' }: Props) {
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
            {postKey ? (
                <>
                    <span aria-hidden>·</span>
                    <Likes
                        postKey={postKey}
                        isValidPage={false}
                        variant="compact"
                    />
                </>
            ) : null}
        </div>
    );
}

export default PostMeta;
