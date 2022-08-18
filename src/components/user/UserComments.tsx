import { FC } from "react";
import { trpc } from "@/utils/trpc";
import CommentSkeleton from "../common/CommentSkeleton";
import Comment from "../common/Comment";
import EmptyMessage from "./EmptyTab";

const UserComments: FC<{ user: string; isSelected: boolean }> = ({
  user,
  isSelected,
}) => {
  const commentQuery = trpc.useQuery(["user.get-comments", { user }], {
    enabled: isSelected,
  });

  return (
    <>
      {commentQuery.isLoading &&
        Array(13)
          .fill(0)
          .map((skeleton, idx) => <CommentSkeleton key={idx} />)}
      {commentQuery.data?.comments.map((comment) => (
        // TODO: Fix this
        <Comment
          isCommentAuthor={false}
          isCommentAuthorMod={false}
          isModerator={false}
          isAdmin={false}
          key={comment.id}
          {...comment}
        />
      ))}
      {commentQuery.data?.comments.length === 0 && <EmptyMessage />}
    </>
  );
};

export default UserComments;
