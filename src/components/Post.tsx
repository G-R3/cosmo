import Link from "next/link";
import { motion } from "framer-motion";
import Markdown from "../components/Markdown";
interface Props {
  id: number;
  title: string;
  content?: string | null;
  slug?: string | null;
}

const Post: React.FC<Props> = ({ id, title, content, slug }) => {
  return (
    <div className="bg-accentFour dark:bg-accentOne border-2 border-transparent hover:border-highlight w-full rounded-md p-5 transition-all">
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-xl font-semibold"
      >
        {title}
      </motion.h2>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex gap-2 mb-3 text-accentFive"
      >
        <small>Posted by</small>
        <small>Tuxedoed</small>
        <small>10 hrs ago</small>
      </motion.span>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="ellipsis"
      >
        <Markdown content={content ? content : ""} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-between mt-3"
      >
        <div className="flex justify-center items-center gap-2 text-accentFive">
          <button>Upvote</button>
          <span>Vote</span>
          <button>Downvote</button>
        </div>

        <Link href={`/post/${slug}`}>
          <a className="text-accentFive">100 Comment</a>
        </Link>
      </motion.div>
    </div>
  );
};

export default Post;
