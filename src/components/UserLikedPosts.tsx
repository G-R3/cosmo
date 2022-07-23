import { FC } from "react";
import { trpc } from "@/utils/trpc";
import useLikePost from "@/hooks/useLikePost";
import useSavePost from "@/hooks/useSavePost";
import PostSkeleton from "./PostSkeleton";
import Post from "./Post";

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
      {likedPostQuery.data?.posts.length === 0 && (
        <div className="flex flex-col items-center text-grayAlt">
          <p className="font-bold text-lg mt-6">Its empty here</p>
          <p className="text-xl">😢</p>
        </div>
      )}
    </>
  );
};

export default UserLikedPosts;
