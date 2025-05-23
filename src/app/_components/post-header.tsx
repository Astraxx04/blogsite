import Avatar from './avatar';
import CoverImage from './cover-image';
import DateFormatter from './date-formatter';
import Likes from './likes';
import { PostTitle } from '@/app/_components/post-title';
import { type Author } from '@/interfaces/author';

type Props = {
    title: string;
    coverImage: string;
    date: string;
    author: Author;
    postKey: string;
};

export function PostHeader({
    title,
    coverImage,
    date,
    author,
    postKey,
}: Props) {
    return (
        <>
            <PostTitle>{title}</PostTitle>
            <div className="hidden md:block md:mb-12 lg:mx-32">
                <Avatar name={author.name} picture={author.picture} />
            </div>
            <div className="mb-6 text-lg lg:mx-32 mx-auto">
                <DateFormatter dateString={date} />
            </div>
            <div className="mb-6 text-lg lg:mx-32 mx-auto">
                <Likes postKey={postKey} isValidPage={true} />
            </div>
            <div className="mb-8 md:mb-16 sm:mx-0 lg:mx-32">
                <CoverImage title={title} src={coverImage} />
            </div>
            <div className="max-w-2xl">
                <div className="block md:hidden mb-6 ml-0">
                    <Avatar name={author.name} picture={author.picture} />
                </div>
            </div>
        </>
    );
}
