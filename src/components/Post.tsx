import Link from "next/link";
import { motion } from "framer-motion";
import Markdown from "../components/Markdown";
import { trpc } from "../utils/trpc";
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
  hasVoted: Vote | null;
  community: { id: number; name: string };
}

const Post: React.FC<Props> = ({
  id,
  title,
  content,
  slug,
  username,
  commentCount,
  totalVotes,
  hasVoted,
  community,
}) => {
  const utils = trpc.useContext();
  const voteMutation = trpc.useMutation("vote.create", {
    onSuccess(data, variables, context) {
      utils.invalidateQueries("post.all");
    },
  });

  const handleVote = (vote: number, postId: number) => {
    voteMutation.mutate({ voteType: vote, postId });
  };

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
          Posted to <span className="text-highlight">{community.name}</span> by{" "}
          {username} 10 hrs ago
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
            onClick={() => handleVote(1, id)}
            className={`rounded-md p-1 text-xs ${
              hasVoted?.voteType === 1 && "bg-orange-500 text-whiteAlt"
            }`}
          >
            Upvote
          </button>
          <span>{totalVotes}</span>
          <button
            data-cy="downvote-post"
            onClick={() => handleVote(-1, id)}
            className={`rounded-md p-1 text-xs ${
              hasVoted?.voteType === -1 && "bg-indigo-400 text-whiteAlt"
            }`}
          >
            Downvote
          </button>
        </div>

        <Link href={`/post/${slug}`}>
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
