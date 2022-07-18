import { trpc } from "@/utils/trpc";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { memo, useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { BiErrorCircle } from "react-icons/bi";
import Markdown from "./Markdown";
import MarkdownTipsModal from "./MarkdownTipsModal";
import CommentDeleteModal from "./CommentDeleteModal";
import Textarea from "./TextareaAutosize";

interface Props {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
}
const Comment: React.FC<Props> = ({
  id,
  content: commentBody,
  createdAt,
  updatedAt,
  author,
}) => {
  const { data: session } = useSession();
  const [content, setContent] = useState(commentBody);
  const [isEditing, setIsEditing] = useState(false);
  const utils = trpc.useContext();
  const commentEditMutation = trpc.useMutation("comment.edit", {
    onSuccess(data, variables, context) {
      utils.invalidateQueries([
        "comment.get-by-postId",
        { postId: data.comment.postId },
      ]);
      setIsEditing(false);
    },
  });

  const handleEdit = (e: any, commentId: number, newCommentBody: string) => {
    e.preventDefault();
    commentEditMutation.mutate({ commentId, content: newCommentBody });
  };

  return (
    <div className="bg-whiteAlt flex gap-5 dark:bg-darkOne py-3 px-5 rounded-md">
      <div className="bg-foreground dark:bg-darkTwo min-h-full min-w-[4px] rounded-full"></div>
      <div className="flex flex-col flex-grow">
        <div className="flex items-center gap-3">
          <Image
            src={author?.image ?? ""}
            alt={author.name ? author.name : `${author.name} Avatar`}
            width={28}
            height={28}
            className="rounded-full"
            priority
          />
          <span className="text-grayAlt">{author.name}</span>
          {/* <span>{createdAt}</span> */}
        </div>
        <div className="mt-5 mb-3">
          {isEditing ? (
            <form
              id="commentEditForm"
              className="flex flex-col gap-2 mb-3"
              onSubmit={(e) => handleEdit(e, id, content)}
            >
              <MarkdownTipsModal />
              <Textarea
                data-cy="comment-edit-textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What are your thoughts?"
                minHeight={220}
              />
            </form>
          ) : (
            <Markdown content={commentBody} />
          )}
        </div>

        {author.id === session?.user.id && (
          <div className="flex justify-end gap-5 items-center">
            <CommentDeleteModal commentId={id} />
            <button
              data-cy="comment-edit"
              onClick={() => {
                setContent(commentBody);
                setIsEditing((prev) => !prev);
              }}
              className="py-1 px-2 flex items-center gap-[6px] text-grayAlt hover:text-blue-400 focus:text-blue-400"
            >
              <FiEdit2 />
              {isEditing ? "Cancel Edit" : "Edit"}
            </button>
            {isEditing && (
              <button
                disabled={
                  commentEditMutation.isLoading ||
                  commentBody === content ||
                  !content
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
