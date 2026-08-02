import markdownStyles from './markdown-styles.module.css';

type Props = {
    content: string;
};

export function PostBody({ content }: Props) {
    return (
        <div className="mx-auto max-w-reading">
            <div
                data-post-body
                className={markdownStyles['markdown']}
                dangerouslySetInnerHTML={{ __html: content }}
            />
        </div>
    );
}
