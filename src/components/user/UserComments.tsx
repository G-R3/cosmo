import { FC } from "react";
import { trpc } from "@/utils/trpc";
import { useSession } from "next-auth/react";
import CommentSkeleton from "../common/CommentSkeleton";
import Comment from "../common/Comment";
import EmptyMessage from "./EmptyTab";

const UserComments: FC<{ user: string; isSelected: boolean }> = ({
  user,
  isSelected,
}) => {
  const { data: session } = useSession();
  const commentQuery = trpc.useQuery(["user.get-comments", { user }], {
    enabled: isSelected,
  });

  return (
    <>
      {commentQuery.isLoading &&
        Array(13)
          .fill(0)
          .map((skeleton, idx) => <CommentSkeleton key={idx} />)}
      {commentQuery.data?.comments.map((comment) => {
        const isAuthorMod = comment.post.community.moderators.some(
          (mod) => mod.userId === comment.author.id,
        );
        const isModerator = comment.post.community.moderators.some(
          (mod) => mod.userId === session?.user.id,
        );
        return (
          <Comment
            key={comment.id}
            {...comment}
            isAuthorMod={isAuthorMod}
            isModerator={isModerator}
          />
        );
      })}
      {commentQuery.data?.comments.length === 0 && <EmptyMessage />}
    </>
  );
};

export default UserComments;
