import { FC } from "react";
import { trpc } from "@/utils/trpc";
import useLikePost from "@/hooks/useLikePost";
import PostSkeleton from "../Post/PostSkeleton";
import Post from "../Post/Post";
import useSavePost from "@/hooks/useSavePost";

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
      {savedPostQuery.data?.posts.length === 0 && (
        <div className="flex flex-col items-center text-grayAlt">
          <p className="font-bold text-lg mt-6">Its empty here</p>
          <p className="text-xl">😢</p>
        </div>
      )}
    </>
  );
};

export default UserSavedPosts;
