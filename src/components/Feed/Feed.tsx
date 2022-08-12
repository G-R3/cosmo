import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { trpc } from "@/utils/trpc";
import PostSkeleton from "../common/PostSkeleton";
import Post from "../common/Post";
import UserCard from "@/components/Feed/UserCard";
import useLikePost from "@/hooks/useLikePost";
import useSavePost from "@/hooks/useSavePost";
import CustomHead from "../common/CustomHead";

const Feed = () => {
  const { data: session } = useSession();
  const postQuery = trpc.useQuery(["post.feed"]);
  const { onLike, onUnlike } = useLikePost("post.feed");
  const { onSave, onUnsave } = useSavePost("post.feed");

  if (postQuery.isError) {
    return (
      <h1 className="text-grayAlt font-bold text-2xl text-center">
        Something went wrong and no post could be found. Try again later.
      </h1>
    );
  }

  return (
    <>
      <CustomHead />
      <section className="flex gap-5">
        <motion.div className="flex-1 pb-5 flex flex-col items-center gap-3">
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

          {postQuery?.data?.posts?.length === 0 && (
            <div className="flex flex-col gap-5 justify-center items-center h-full">
              <h1 className="text-grayAlt font-bold text-2xl">
                No posts found
              </h1>
              <div>
                <Link href={"/submit"}>
                  <a className="border-2  bg-foreground text-darkOne self-end h-10 p-4 w-full rounded-md flex items-center justify-center disabled:opacity-50 animate-popIn active:hover:animate-none active:focus:animate-none active:focus:scale-95 active:hover:scale-95 transition-all">
                    Create Post
                  </a>
                </Link>
              </div>
            </div>
          )}
        </motion.div>
        {!!session?.user && (
          <div className="hidden lg:block">
            <UserCard {...session?.user} />
          </div>
        )}
      </section>
    </>
  );
};

export default Feed;
