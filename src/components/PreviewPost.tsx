import { memo } from "react";
import ReactMarkdown from "react-markdown";

interface Props {
  title: string;
  content: string;
}

const PreviewPost: React.FC<Props> = ({ title, content }) => {
  return (
    <section className="px-4 py-2 border-2 border-neutral">
      <h1 className="text-2xl">{title}</h1>
      <ReactMarkdown
        // eslint-disable-next-line react/no-children-prop
        children={content}
        linkTarget="_blank"
        components={{
          h1: ({ node, ...props }) => (
            <h2 className="text-xl font-normal" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h3 className="text-lg font-normal" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h4 className="text-md font-normal" {...props} />
          ),
          h4: ({ node, ...props }) => (
            <h5 className="text-sm font-normal" {...props} />
          ),
          h5: ({ node, ...props }) => (
            <h6 className="text-sm font-normal" {...props} />
          ),
          h6: "p",
        }}
        className="min-w-full prose rounded-md"
      />
    </section>
  );
};

export default memo(PreviewPost);
