import { FC } from "react";
import { trpc } from "@/utils/trpc";
import useLikePost from "@/hooks/useLikePost";
import useSavePost from "@/hooks/useSavePost";
import PostSkeleton from "./Post/PostSkeleton";
import Post from "./Post/Post";

const UserPosts: FC<{ user: string; isSelected: boolean }> = ({
  user,
  isSelected,
}) => {
  const postQuery = trpc.useQuery(["user.get-posts", { user }], {
    enabled: isSelected,
  });

  const { onLike, onUnlike } = useLikePost("user.get-posts", { user });
  const { onSave, onUnsave } = useSavePost("user.get-posts", { user });

  return (
    <>
      {postQuery.isLoading &&
        Array(13)
          .fill(0)
          .map((skeleton, idx) => <PostSkeleton key={idx} />)}

      {postQuery?.data?.posts &&
        postQuery.data.posts?.map((post) => (
          <Post
            key={post.id}
            {...post}
            onLike={onLike}
            onUnlike={onUnlike}
            onSave={onSave}
            onUnsave={onUnsave}
          />
        ))}
      {postQuery.data?.posts.length === 0 && (
        <div className="flex flex-col items-center text-grayAlt">
          <p className="font-bold text-lg mt-6">Its empty here</p>
          <p className="text-xl">😢</p>
        </div>
      )}
    </>
  );
};

export default UserPosts;
