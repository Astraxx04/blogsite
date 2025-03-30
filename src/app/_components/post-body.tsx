import markdownStyles from "./markdown-styles.module.css";


type Props = {
  content: string;
};

export function PostBody({ content }: Props) {
  return (
    <div className="lg:max-w-6xl max-w-3xl mx-auto">
      <div
        className={`${markdownStyles["markdown"]}`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
