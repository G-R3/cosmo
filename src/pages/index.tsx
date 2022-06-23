import { trpc } from "../utils/trpc";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Post from "../components/Post";
import UserCard from "../components/UserCard";
import PostSkeleton from "../components/PostSkeleton";

const Home = () => {
  const postQuery = trpc.useQuery(["post.all"], {
    staleTime: 1000 * 60 * 60 * 24, // 24 hours in ms
  });
  const { data: session } = useSession();

  if (postQuery.error) {
    return <div>Error grabbing posts</div>;
  }

  const { data: posts } = postQuery;

  return (
    <>
      <section className="lg:grid lg:grid-cols-5 gap-x-5">
        <div className="hidden lg:block">
          <div className="bg-neutral rounded-md sticky top-20">
            <h1 className="text-center">Todo Add something here</h1>
          </div>
        </div>
        <motion.div className="col-span-3 flex flex-col items-center gap-10">
          {postQuery.isLoading
            ? Array(13)
                .fill(0)
                .map((skelton, idx) => <PostSkeleton key={idx} />)
            : posts?.map((post) => (
                <Post
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  content={post.content}
                  slug={post.slug}
                />
              ))}
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
