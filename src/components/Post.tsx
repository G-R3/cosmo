import Link from "next/link";
import { motion } from "framer-motion";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { useSession } from "next-auth/react";
import Markdown from "../components/Markdown";
import { trpc } from "@/utils/trpc";
import { useContext } from "react";

interface Props {
  id: number;
  title: string;
  content?: string | null;
  slug: string;
  author: { id: string; name: string | null; image: string | null };
  commentCount: number;
  likes: { postId: number; userId: string }[];
  community: { id: number; name: string };
  savedBy: { postId: number; userId: string }[];
  onLike: (postId: number) => void;
  onUnlike: (postId: number) => void;
  onSave: (postId: number) => void;
  onUnsave: (postId: number) => void;
}

const Post: React.FC<Props> = ({
  id,
  title,
  content,
  slug,
  author,
  commentCount,
  likes,
  community,
  savedBy,
  onLike,
  onUnlike,
  onSave,
  onUnsave,
}) => {
  const { data: session } = useSession();
  const utils = trpc.useContext();
  const isLikedByUser = likes.find((like) => like.userId === session?.user.id);
  const isSavedByUser = savedBy.find(
    (save) => save.userId === session?.user.id,
  );
  // const savePostMutation = trpc.useMutation("post.save", {
  //   onSuccess(data, variables, context) {
  //     utils.invalidateQueries({
  //       predicate(query: any) {
  //         return query.queryKey[0].startsWith("post");
  //       },
  //     });
  //   },
  // });
  // const unSavePostMutation = trpc.useMutation("post.unsave", {
  //   onSuccess(data, variables, context) {
  //     utils.invalidateQueries({
  //       predicate(query: any) {
  //         return query.queryKey[0].startsWith("post");
  //       },
  //     });
  //   },
  // });

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
          by{" "}
          <Link href={`/user/${author.id}`}>
            <a className="text-darkOne dark:text-foreground hover:underline hover:underline-offset-1">
              {author.name}
            </a>
          </Link>{" "}
          10 hrs ago
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
        <div className="flex items-center gap-3 text-grayAlt">
          <button
            onClick={isSavedByUser ? () => onUnsave(id) : () => onSave(id)}
            // disabled={
            //   unSavePostMutation.isLoading || savePostMutation.isLoading
            // }
            className="flex items-center gap-[6px] hover:text-whiteAlt focus:text-whiteAlt transition-colors"
          >
            {isSavedByUser ? <BsBookmarkFill /> : <BsBookmark />}
            {isSavedByUser ? "Unsave" : "Save"}
          </button>
          {author.id === session?.user.id && (
            <Link href={`/c/${community.name}/${id}/${slug}/edit`}>
              <a
                data-cy="post-edit-link"
                className="py-1 px-2 flex items-center gap-[6px] hover:text-blue-400 focus:text-blue-400 transition-colors"
              >
                <FiEdit2 />
                Edit
              </a>
            </Link>
          )}

          <Link href={`/c/${community.name}/${id}/${slug}`}>
            <a data-cy="post-link">
              {commentCount}{" "}
              {commentCount > 1 || commentCount === 0 ? "comments" : "comment"}
            </a>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Post;
