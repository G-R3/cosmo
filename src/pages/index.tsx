import type { NextPage } from "next";
import { trpc } from "../utils/trpc";
import Navbar from "../components/Navbar";

const Home: NextPage = () => {
  const postQuery = trpc.useQuery(["post.all"]);

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
            className="w-full max-w-3xl bg-white rounded-md p-5"
          >
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <span className="flex gap-2 mb-3">
              <small>Posted by</small>
              <small>Tuxedoed</small>
              <small>10 hrs ago</small>
            </span>
            {/* <Image width={256} height={256} /> */}
            {/* <div className="h-96 w-full bg-gray-300 rounded-md"></div> */}
            <div className="truncate">{post.content}</div>
            <div className="flex justify-between mt-3">
              <div className="flex justify-center items-center gap-2">
                <button>Upvote</button>
                <span>123</span>
                <button>Downvote</button>
              </div>
              <div className="flex gap-5">
                <button>Share</button>
                <button>Save</button>
                <button>100 Comment</button>
              </div>
            </div>
          </div>
        ))}
      </section>
    </>
  );
};

export default Home;
