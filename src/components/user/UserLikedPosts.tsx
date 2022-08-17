import { FC } from "react";
import { trpc } from "@/utils/trpc";
import useLikePost from "@/hooks/useLikePost";
import useSavePost from "@/hooks/useSavePost";
import Post from "../common/Post";
import PostSkeleton from "../common/PostSkeleton";
import EmptyMessage from "./EmptyTab";

const UserLikedPosts: FC<{ user: string; isSelected: boolean }> = ({
  user,
  isSelected,
}) => {
  const likedPostQuery = trpc.useQuery(["user.get-liked-posts", { user }], {
    enabled: isSelected,
  });

  const { onLike, onUnlike } = useLikePost("user.get-liked-posts", { user });
  const { onSave, onUnsave } = useSavePost("user.get-liked-posts", { user });

  return (
    <>
      {likedPostQuery.isLoading &&
        Array(13)
          .fill(0)
          .map((skeleton, idx) => <PostSkeleton key={idx} />)}

      {likedPostQuery?.data?.posts &&
        likedPostQuery.data.posts?.map((post) => (
          <Post
            key={post.id}
            {...post}
            onLike={onLike}
            onUnlike={onUnlike}
            onSave={onSave}
            onUnsave={onUnsave}
          />
        ))}
      {likedPostQuery.data?.posts.length === 0 && <EmptyMessage />}
    </>
  );
};

export default UserLikedPosts;
