import Link from "next/link";
import { motion } from "framer-motion";
import { AiFillHeart, AiOutlineComment } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { useSession } from "next-auth/react";
import Markdown from "./Markdown";
import clx from "@/lib/classnames";

interface Props {
  id: string;
  title: string;
  content?: string | null;
  slug: string;
  author: {
    id: string;
    name: string | null;
    image: string | null;
    role: string;
  };
  likes: { postId: string; userId: string }[];
  community: { id: string; name: string; moderators: { userId: string }[] };
  savedBy: { postId: string; userId: string }[];
  _count: { comments: number };
  onLike: (postId: string) => void;
  onUnlike: (postId: string) => void;
  onSave: (postId: string) => void;
  onUnsave: (postId: string) => void;
}

const Post: React.FC<Props> = ({
  id,
  title,
  content,
  slug,
  author,
  likes,
  community,
  savedBy,
  _count,
  onLike,
  onUnlike,
  onSave,
  onUnsave,
}) => {
  const { data: session } = useSession();
  const isLikedByUser = likes.find((like) => like.userId === session?.user.id);
  const isSavedByUser = savedBy.find(
    (save) => save.userId === session?.user.id,
  );
  const isAuthor = author.id === session?.user.id;
  const isAuthorMod = community.moderators.some(
    (mod) => mod.userId === author.id,
  );
  const isAuthorAdmin = author.role === "ADMIN";
  const isModerator = community.moderators.some(
    (mod) => mod.userId === session?.user.id,
  );
  const isAdmin = session?.user.role === "ADMIN";

  return (
    <div className="bg-whiteAlt dark:bg-darkOne border-2 border-transparent hover:border-highlight w-full rounded-md p-5 transition-all">
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-xl font-semibold"
      >
        {title}
      </motion.h2>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-3 text-grayAlt text-xs"
      >
        Posted to{" "}
        <Link href={`/community/${community.name}`}>
          <a className="text-highlight font-semibold">{community.name}</a>
        </Link>{" "}
        by{" "}
        <Link href={`/user/${author.id}`}>
          <a className="text-darkOne dark:text-foreground hover:underline hover:underline-offset-1">
            {author.name}
          </a>
        </Link>
        {isAuthorAdmin ? (
          <span className="text-highlight font-bold"> ADMIN </span>
        ) : isAuthorMod ? (
          <span className="text-green-500 font-bold"> MOD </span>
        ) : null}
        10 hrs ago
      </motion.div>
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
        className="text-sm font-semibold flex justify-between mt-3"
      >
        <button
          onClick={isLikedByUser ? () => onUnlike(id) : () => onLike(id)}
          className="text-sm flex justify-center items-center gap-2 py-1 px-2 text-grayAlt group rounded hover:bg-red-500/20 focus-visible:bg-red-500/20 focus:outline-none transition-colors"
        >
          {isLikedByUser ? (
            <span>
              <AiFillHeart
                size={16}
                className={clx(isLikedByUser && "text-red-500")}
              />
            </span>
          ) : (
            <span>
              <AiFillHeart
                size={16}
                className="group-hover:text-red-500 transition-colors"
              />
            </span>
          )}
          <span
            className={clx(
              "group-hover:text-red-500 transition-all",
              isLikedByUser && "text-red-500",
            )}
          >
            {likes.length}
          </span>
        </button>
        <div className="text-sm flex items-center gap-2 text-grayAlt">
          <button
            onClick={isSavedByUser ? () => onUnsave(id) : () => onSave(id)}
            className="flex items-center gap-2 py-1 px-2 rounded group hover:bg-foreground hover:text-darkOne hover:dark:bg-secondary hover:dark:text-whiteAlt/80 focus-visible:bg-foreground focus-visible:text-darkOne focus-visible:dark:text-whiteAlt/80 focus-visible:dark:bg-secondary focus:outline-none transition-colors"
          >
            {isSavedByUser ? (
              <BsBookmarkFill size={16} />
            ) : (
              <BsBookmark size={16} />
            )}
            {isSavedByUser ? "Unsave" : "Save"}
          </button>
          {(isAuthor || isModerator || isAdmin) && (
            <Link href={`/post/${id}/edit`}>
              <a
                data-cy="post-edit-link"
                className="py-1 px-2 flex items-center gap-2 rounded hover:bg-blue-400/20 hover:text-blue-400 focus-visible:bg-blue-400/20 focus-visible:text-blue-400 focus:outline-none transition-colors"
              >
                <FiEdit2 size={16} />
                Edit
              </a>
            </Link>
          )}
          <Link href={`/post/${id}/`}>
            <a
              data-cy="post-link"
              className="flex items-center gap-2 py-1 px-2 rounded hover:bg-foreground hover:text-darkOne hover:dark:bg-secondary hover:dark:text-whiteAlt/80 focus-visible:bg-foreground focus-visible:text-darkOne focus-visible:dark:text-whiteAlt/80 focus-visible:dark:bg-secondary focus:outline-none transition-colors"
            >
              <AiOutlineComment size={18} />
              {_count.comments}
              {_count.comments === 1 ? " Comment" : " Comments"}
            </a>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Post;
