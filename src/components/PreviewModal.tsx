import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";

interface Props {
  title: string;
  content: string;
}
const PreviewModal: React.FC<Props> = ({ title, content }) => {
  const placeholder = `# Your Post 
  Let the world know what you're thinking. Start with a title and then add some content to spice up your post! 😀
  `;
  return (
    <motion.label
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.1, type: "spring" } }}
      htmlFor="my-modal-4"
      className="modal cursor-pointer"
    >
      <motion.label
        className="modal-box relative w-11/12 max-w-3xl p-5 bg-neutral rounded-md flex flex-col"
        htmlFor=""
      >
        <h1 className="text-2xl">{title ? title : "Hello World"}</h1>
        <small className="mb-3 mt-1 block">Post by Tuxedoed 10 hours ago</small>
        <ReactMarkdown
          // eslint-disable-next-line react/no-children-prop
          children={content ? content : placeholder}
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
        <div className="flex justify-between mt-3">
          <div className="flex justify-center items-center gap-2">
            <button>Upvote</button>
            <span>Vote</span>
            <button>Downvote</button>
          </div>

          <a>100 Comments</a>
        </div>
      </motion.label>
    </motion.label>
  );
};

export default PreviewModal;
