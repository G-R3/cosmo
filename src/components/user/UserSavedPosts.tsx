import { FC } from "react";
import { trpc } from "@/utils/trpc";
import useLikePost from "@/hooks/useLikePost";
import Post from "../common/Post";
import PostSkeleton from "../common/PostSkeleton";
import useSavePost from "@/hooks/useSavePost";
import EmptyMessage from "./EmptyTab";

const UserSavedPosts: FC<{ user: string; isSelected: boolean }> = ({
  user,
  isSelected,
}) => {
  const savedPostQuery = trpc.useQuery(["user.get-saved-posts", { user }], {
    enabled: isSelected,
  });
  const { onLike, onUnlike } = useLikePost("user.get-saved-posts", { user });
  const { onSave, onUnsave } = useSavePost("user.get-saved-posts", { user });

  return (
    <>
      {savedPostQuery.isLoading &&
        Array(13)
          .fill(0)
          .map((skeleton, idx) => <PostSkeleton key={idx} />)}

      {savedPostQuery?.data?.posts &&
        savedPostQuery.data.posts?.map((post) => (
          <Post
            key={post.id}
            {...post}
            onLike={onLike}
            onUnlike={onUnlike}
            onSave={onSave}
            onUnsave={onUnsave}
          />
        ))}
      {savedPostQuery.data?.posts.length === 0 && <EmptyMessage />}
    </>
  );
};

export default UserSavedPosts;
