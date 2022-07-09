import Link from "next/link";
import { motion } from "framer-motion";
import Markdown from "../components/Markdown";
interface Vote {
  voteType: number;
  postId: number;
  userId: string;
}
interface Props {
  id: number;
  title: string;
  content?: string | null;
  slug: string;
  username: string | null;
  commentCount: number;
  totalVotes: number;
  isLikedByUser: Vote | undefined;
  community: { id: number; name: string };
  onVote: (postId: number, voteType: number) => void;
}

const Post: React.FC<Props> = ({
  id,
  title,
  content,
  slug,
  username,
  commentCount,
  totalVotes,
  isLikedByUser,
  community,
  onVote,
}) => {
  return (
    <div className="bg-whiteAlt dark:bg-darkOne border-2 border-transparent hover:border-highlight w-full rounded-md p-5 transition-all">
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
        className="flex gap-2 mb-3 text-grayAlt"
      >
        <small>
          Posted to{" "}
          <Link href={`/c/${community.name}`}>
            <a className="text-highlight font-semibold">{community.name}</a>
          </Link>{" "}
          by {username} 10 hrs ago
        </small>
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
        <div className="flex justify-center items-center gap-2 text-grayAlt">
          <button
            data-cy="upvote-post"
            onClick={() => onVote(1, id)}
            className={`rounded-md p-1 text-xs ${
              isLikedByUser?.voteType === 1 && "bg-orange-500 text-whiteAlt"
            }`}
          >
            Upvote
          </button>
          <span>{totalVotes}</span>
          <button
            data-cy="downvote-post"
            onClick={() => onVote(-1, id)}
            className={`rounded-md p-1 text-xs ${
              isLikedByUser?.voteType === -1 && "bg-indigo-400 text-whiteAlt"
            }`}
          >
            Downvote
          </button>
        </div>

        <Link href={`/c/${community.name}/${id}/${slug}`}>
          <a data-cy="post-link" className="text-grayAlt">
            {commentCount}{" "}
            {commentCount > 1 || commentCount === 0 ? "comments" : "comment"}
          </a>
        </Link>
      </motion.div>
    </div>
  );
};

export default Post;
