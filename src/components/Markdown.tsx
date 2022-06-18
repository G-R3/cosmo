import ReactMarkdown from "react-markdown";

const Markdown: React.FC<{ content: string }> = ({ content }) => {
  return (
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
  );
};

export default Markdown;
