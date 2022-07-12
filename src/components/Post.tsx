import Link from "next/link";
import { motion } from "framer-motion";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import Markdown from "../components/Markdown";
import { useSession } from "next-auth/react";

interface Props {
  id: number;
  title: string;
  content?: string | null;
  slug: string;
  user: { id: string; name: string | null; image: string | null };
  commentCount: number;
  likes: { postId: number; userId: string }[];
  community: { id: number; name: string };
  onLike: (postId: number) => void;
  onUnlike: (postId: number) => void;
}

const Post: React.FC<Props> = ({
  id,
  title,
  content,
  slug,
  user,
  commentCount,
  likes,
  community,
  onLike,
  onUnlike,
}) => {
  const { data: session } = useSession();

  const isLikedByUser = likes.find((like) => like.userId === session?.user.id);

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
          by {user.name} 10 hrs ago
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
        <button
          onClick={isLikedByUser ? () => onUnlike(id) : () => onLike(id)}
          className="flex justify-center items-center gap-2 text-grayAlt group"
        >
          {isLikedByUser ? (
            <span className="rounded-full p-1 group-hover:bg-red-500/20 group-hover:outline outline-2 outline-red-500/25 transition-all">
              <AiFillHeart
                size={20}
                className={`${isLikedByUser ? "text-red-500" : ""}`}
              />
            </span>
          ) : (
            <span className="rounded-full p-1 group-hover:bg-red-500/20 group-hover:outline outline-2 outline-red-500/25 transition-all">
              <AiOutlineHeart size={20} />
            </span>
          )}
          <span className={`${isLikedByUser ? "text-red-500" : ""}`}>
            {likes.length}
          </span>
        </button>

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
