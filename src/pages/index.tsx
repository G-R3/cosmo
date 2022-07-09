import { trpc } from "../utils/trpc";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Post from "../components/Post";
import UserCard from "../components/UserCard";
import PostSkeleton from "../components/PostSkeleton";
import Link from "next/link";

const Home = () => {
  const { data: session } = useSession();
  const utils = trpc.useContext();
  const postQuery = trpc.useQuery(["post.feed"]);
  const likeMutation = trpc.useMutation(["post.like"], {
    onSuccess(data, variables, context) {
      utils.invalidateQueries("post.feed");
    },
  });
  const unlikeMutation = trpc.useMutation(["post.unlike"], {
    onSuccess(data, variables, context) {
      utils.invalidateQueries("post.feed");
    },
  });

  if (postQuery.error) {
    return (
      <h1 className="text-grayAlt font-bold text-2xl text-center">
        Something happened and posts could not be fetched
      </h1>
    );
  }

  const { data: posts } = postQuery;

  const onLike = (postId: number) => {
    likeMutation.mutate({ postId });
  };
  const onUnlike = (postId: number) => {
    unlikeMutation.mutate({ postId });
  };

  return (
    <>
      <section className="lg:grid lg:grid-cols-5 gap-x-5 min-h-full">
        <div className="hidden lg:block">
          <div className="bg-neutral rounded-md sticky top-20">
            <h1 className="text-center">Todo Add something here</h1>
          </div>
        </div>
        <motion.div className="col-span-3 pb-5 flex flex-col items-center gap-10">
          {postQuery.isLoading &&
            Array(13)
              .fill(0)
              .map((skeleton, idx) => <PostSkeleton key={idx} />)}

          {posts &&
            posts?.map((post) => (
              <Post
                key={post.id}
                {...post}
                onLike={onLike}
                onUnlike={onUnlike}
              />
            ))}

          {posts?.length === 0 && (
            <div className="flex flex-col gap-5 justify-center items-center h-full">
              <h1 className="text-grayAlt font-bold text-2xl">
                No posts found
              </h1>
              <div>
                <Link href={"/submit"}>
                  <a className="bg-foreground text-darkOne self-end h-10 p-4 w-full rounded-md flex items-center justify-center disabled:opacity-50 animate-popIn active:hover:animate-none active:focus:animate-none active:focus:scale-95 active:hover:scale-95 transition-all">
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

export default Home;
