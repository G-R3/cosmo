import type { NextPage } from "next";
import { trpc } from "../utils/trpc";

import Post from "../components/Post";
import { useSession } from "next-auth/react";
import UserCard from "../components/UserCard";

const Home: NextPage = () => {
  const postQuery = trpc.useQuery(["post.all"], {
    staleTime: 1000 * 60 * 60 * 24, // 24 hours in ms
  });
  const { data: session } = useSession();

  if (postQuery.isLoading) {
    return <div>Loading...</div>;
  }

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
        <div className="col-span-3 flex flex-col items-center gap-10">
          {posts?.map((post) => (
            <Post
              key={post.id}
              id={post.id}
              title={post.title}
              content={post.content}
              slug={post.slug}
            />
          ))}
        </div>
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
