import { trpc } from "@/utils/trpc";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { memo, useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Markdown from "./common/Markdown";
import MarkdownTipsModal from "./MarkdownTipsModal";
import CommentDeleteModal from "./CommentDeleteModal";
import TextareaAutosize from "./common/TextareaAutosize";

type Inputs = {
  commentId: string;
  commentContent: string;
};

const schema = z.object({
  commentId: z.string(),
  commentContent: z
    .string()
    .trim()
    .min(1, { message: "Comment can't be empty" })
    .max(500, { message: "Comment must be less than 500 characters" }),
});
interface Props {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    name: string | null;
    image: string | null;
    role: string;
  };
  isCommentAuthor: boolean;
  isCommentAuthorMod: boolean;
  isModerator: boolean;
  isAdmin: boolean;
}
const Comment: React.FC<Props> = ({
  id,
  content,
  createdAt,
  updatedAt,
  author,
  isCommentAuthor,
  isCommentAuthorMod,
  isModerator,
  isAdmin,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty, isValid },
  } = useForm<Inputs>({
    defaultValues: { commentContent: content, commentId: id },
    resolver: zodResolver(schema),
    mode: "onChange",
  });
  const [isEditing, setIsEditing] = useState(false);
  const utils = trpc.useContext();
  const commentEditMutation = trpc.useMutation("comment.edit", {
    onSuccess(data, variables, context) {
      utils.invalidateQueries([
        "comment.get-by-postId",
        { postId: data.comment.postId },
      ]);
      utils.invalidateQueries(["user.get-comments"]);
      setIsEditing(false);
    },
  });

  const editComment: SubmitHandler<Inputs> = (data) => {
    commentEditMutation.mutate({
      commentId: data.commentId,
      content: data.commentContent,
    });
  };

  const isAuthorAdmin = author.role === "ADMIN";

  return (
    <div className="bg-whiteAlt flex gap-5 dark:bg-darkOne py-3 px-5 rounded-md">
      <div className="bg-foreground dark:bg-darkTwo min-h-full min-w-[4px] rounded-full"></div>
      <div className="flex flex-col flex-grow">
        <Link href={`/user/${author.id}`}>
          <a className="w-fit group">
            <div className="flex items-center gap-3 group">
              <Image
                src={author?.image ?? ""}
                alt={author.name ? author.name : `${author.name} Avatar`}
                width={28}
                height={28}
                className="rounded-full"
                priority
              />
              <div>
                <span className="text-darkOne dark:text-grayAlt group-hover:underline group-hover:underline-offset-1">
                  {author.name}
                </span>

                {isAuthorAdmin ? (
                  <span className="text-xs text-highlight font-bold">
                    {" "}
                    ADMIN
                  </span>
                ) : isCommentAuthorMod ? (
                  <span className="text-xs text-green-500 font-bold"> MOD</span>
                ) : null}
              </div>
            </div>
          </a>
        </Link>
        <div className="mt-5 mb-3 ">
          {isEditing ? (
            <form
              id="commentEditForm"
              className="flex flex-col gap-2 mb-3"
              onSubmit={handleSubmit(editComment)}
            >
              <div className="flex justify-between items-center flex-wrap">
                <MarkdownTipsModal />
                {errors.commentContent?.message && (
                  <span className="text-alert">
                    {errors.commentContent.message}
                  </span>
                )}
              </div>
              <TextareaAutosize
                data-cy="comment-edit-textarea"
                placeholder="What are your thoughts?"
                minHeight={220}
                register={register("commentContent")}
              />
            </form>
          ) : (
            <Markdown content={content} />
          )}
        </div>

        {(isCommentAuthor || isModerator || isAdmin) && (
          <div className="flex justify-end gap-5 items-center">
            <CommentDeleteModal commentId={id} />
            {isCommentAuthor && (
              <button
                data-cy="comment-edit"
                onClick={() => {
                  setIsEditing((prev) => !prev);
                }}
                className="py-1 px-2 flex items-center gap-[6px] text-grayAlt hover:text-blue-400 focus:text-blue-400"
              >
                <FiEdit2 />
                {isEditing ? "Cancel Edit" : "Edit"}
              </button>
            )}
            {isCommentAuthor && isEditing && (
              <button
                disabled={
                  commentEditMutation.isLoading ||
                  watch("commentContent") === content ||
                  !(isDirty && isValid)
                }
                form="commentEditForm"
                data-cy="save-comment-edit"
                className="bg-success text-whiteAlt self-end h-12 p-4 rounded-md flex items-center disabled:opacity-50 animate-popIn active:hover:animate-none active:focus:animate-none active:focus:scale-95 active:hover:scale-95 transition-all"
              >
                Save
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(Comment);
