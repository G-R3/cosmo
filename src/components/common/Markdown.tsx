import { memo } from "react";
import ReactMarkdown from "react-markdown";

const Markdown: React.FC<{ content: string }> = ({ content }) => {
  return (
    <ReactMarkdown
      // eslint-disable-next-line react/no-children-prop
      children={content}
      linkTarget="_blank"
      components={{
        h1: ({ node, ...props }) => (
          <h2
            className="text-xl font-normal text-darkOne dark:text-whiteAlt"
            {...props}
          />
        ),
        h2: ({ node, ...props }) => (
          <h3
            className="text-lg font-normal text-darkOne dark:text-whiteAlt"
            {...props}
          />
        ),
        h3: ({ node, ...props }) => (
          <h4
            className="text-md font-normal text-darkOne dark:text-whiteAlt"
            {...props}
          />
        ),
        h4: ({ node, ...props }) => (
          <h5
            className="text-sm font-normal text-darkOne dark:text-whiteAlt"
            {...props}
          />
        ),
        h5: ({ node, ...props }) => (
          <h6
            className="text-sm font-normal text-darkOne dark:text-whiteAlt"
            {...props}
          />
        ),
        h6: "p",
      }}
      className="min-w-full prose prose-p:break-words prose-a:text-blue-500 prose-pre:bg-white/50 prose-pre:dark:bg-darkTwo/50 prose-blockquote:dark:text-whiteAlt prose-code:dark:text-whiteAlt rounded-md text-darkOne dark:text-whiteAlt break-words"
    />
  );
};

export default memo(Markdown);
