import { trpc } from "@/utils/trpc";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { memo, useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Markdown from "./Markdown";
import MarkdownTipsModal from "./MarkdownTipsModal";
import CommentDeleteModal from "./CommentDeleteModal";
import TextareaAutosize from "./TextareaAutosize";
import Button from "./Button";
import Alert from "./Alert";
import { BiErrorCircle } from "react-icons/bi";

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
  isAuthorMod: boolean;
  isModerator: boolean;
}
const Comment: React.FC<Props> = ({
  id,
  content,
  createdAt,
  updatedAt,
  author,
  isAuthorMod,
  isModerator,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<Inputs>({
    defaultValues: { commentContent: content, commentId: id },
    resolver: zodResolver(schema),
    mode: "onChange",
  });
  const [isEditing, setIsEditing] = useState(false);
  const { data: session } = useSession();
  const utils = trpc.useContext();
  const commentEditMutation = trpc.useMutation("comment.edit", {
    onSuccess(data, variables, context) {
      utils.invalidateQueries([
        "comment.get-by-postId",
        { postId: data.comment.postId },
      ]);
      utils.invalidateQueries(["user.get-comments"]);
      setIsEditing(false);
      reset({
        commentContent: data.comment.content,
        commentId: data.comment.id,
      });
    },
  });

  const editComment: SubmitHandler<Inputs> = (data) => {
    commentEditMutation.mutate({
      commentId: data.commentId,
      content: data.commentContent,
    });
  };

  const isCommentAuthor = author.id === session?.user.id;
  const isAuthorAdmin = author.role === "ADMIN";
  const isAdmin = session?.user.role === "ADMIN";

  return (
    <div className="pt-4 px-5">
      <div className="flex items-start gap-3 border-b border-b-grayAlt dark:border-b-secondary pb-3">
        <Link href={`/user/${author.id}`}>
          <a>
            <Image
              src={author?.image ?? ""}
              alt={author.name ? author.name : `${author.name} Avatar`}
              width={28}
              height={28}
              className="rounded-full"
              priority
              quality={100}
            />
          </a>
        </Link>

        <div className="w-full">
          <div className="flex items-center text-grayAlt dark:text-grayAlt">
            <div className="flex items-center gap-1 mr-1">
              <Link href={`/user/${author.id}`}>
                <a className="flex items-center gap-3 hover:dark:text-white hover:text-darkOne hover:underline hover:underline-offset-2">
                  {author.name}
                </a>
              </Link>

              {isAuthorAdmin ? (
                <span className="text-xs text-highlight font-bold">ADMIN</span>
              ) : isAuthorMod ? (
                <span className="text-xs text-green-500 font-bold">MOD</span>
              ) : null}
            </div>
            <span className="text-xs before:content-['•'] before:mr-1">
              10h ago
            </span>
          </div>
          {isEditing ? (
            <form
              id="commentEditForm"
              className="flex flex-col gap-2 mb-3"
              onSubmit={handleSubmit(editComment)}
            >
              <div className="flex justify-between items-center flex-wrap">
                <MarkdownTipsModal />
                <div className="flex flex-col gap-2">
                  {errors.commentContent?.message && (
                    <span className="text-alert">
                      {errors.commentContent.message}
                    </span>
                  )}
                  {commentEditMutation.error && (
                    <Alert type="error">
                      <BiErrorCircle />
                      <span>Oh no! change a few things up and try again</span>
                    </Alert>
                  )}
                </div>
              </div>
              <TextareaAutosize
                data-cy="comment-edit-textarea"
                placeholder="What are your thoughts?"
                minHeight={100}
                register={register("commentContent")}
              />
            </form>
          ) : (
            <Markdown content={content} />
          )}

          {(isCommentAuthor || isModerator || isAdmin) && (
            <div className="flex justify-end gap-5 items-center mt-3">
              <CommentDeleteModal commentId={id} />
              {isCommentAuthor && (
                <button
                  data-cy="comment-edit"
                  onClick={() => {
                    setIsEditing((prev) => !prev);
                  }}
                  className="flex items-center gap-1 text-grayAlt hover:text-blue-400 focus:text-blue-400"
                >
                  <FiEdit2 />
                  {isEditing ? "Cancel Edit" : "Edit"}
                </button>
              )}
              {isCommentAuthor && isEditing && (
                <Button
                  loading={commentEditMutation.isLoading}
                  disabled={
                    watch("commentContent") === content || !isValid || !isDirty
                  }
                  form="commentEditForm"
                  data-cy="save-comment-edit"
                  variant="success"
                  size="md"
                >
                  Save
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(Comment);
