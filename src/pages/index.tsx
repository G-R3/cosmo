import type { NextPage } from "next";
import Link from "next/link";
import { trpc } from "../utils/trpc";

import Navbar from "../components/Navbar";
import Markdown from "../components/Markdown";

const Home: NextPage = () => {
  const postQuery = trpc.useQuery(["post.all"], {
    staleTime: 1000 * 60 * 60 * 24, // 24 hours in ms
  });

  if (postQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (postQuery.error) {
    return <div>Error grabbing posts</div>;
  }

  const { data: posts } = postQuery;

  return (
    <>
      <Navbar />
      <section className="flex flex-col items-center gap-10">
        {posts?.map((post) => (
          <div
            key={post.id}
            className="bg-neutral border-2 border-transparent hover:border-accent w-full max-w-3xl rounded-md p-5 transition-all"
          >
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <span className="flex gap-2 mb-3">
              <small>Posted by</small>
              <small>Tuxedoed</small>
              <small>10 hrs ago</small>
            </span>
            {/* <Image width={256} height={256} /> */}
            {/* <div className="h-96 w-full bg-gray-300 rounded-md"></div> */}
            {/* <div className="truncate">{post.content}</div> */}
            <div className="two-line-ellipsis">
              <Markdown content={post.content ? post.content : ""} />
            </div>
            <div className="flex justify-between mt-3">
              <div className="flex justify-center items-center gap-2">
                <button>Upvote</button>
                <span>Vote</span>
                <button>Downvote</button>
              </div>

              <Link href={`/post/${post.slug}`}>
                <a>100 Comment</a>
              </Link>
            </div>
          </div>
        ))}
      </section>
    </>
  );
};

export default Home;
