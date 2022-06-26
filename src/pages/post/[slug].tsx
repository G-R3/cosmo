import { router } from "@trpc/server";
import Link from "next/link";
import { useRouter } from "next/router";
import Markdown from "../../components/Markdown";
import { trpc } from "../../utils/trpc";

const Post = () => {
  const slug = useRouter().query.slug as string;
  const postQuery = trpc.useQuery(["post.get", { slug }]);

  if (postQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (postQuery.error) {
    return <div>Error grabbing post</div>;
  }

  const { data: post } = postQuery;

  return (
    <div className="max-w-3xl mx-auto">
      <section className="p-5 bg-whiteAlt dark:bg-darkOne">
        <h1 className="text-2xl">{post?.title}</h1>
        <small className="mb-3 mt-1 block text-grayAlt">
          Post by Tuxedoed 10 hours ago
        </small>
        <Markdown content={post?.content ? post.content : ""} />
        <div className="flex justify-between mt-3 text-grayAlt">
          <div className="flex justify-center items-center gap-2">
            <button>Upvote</button>
            <span>Vote</span>
            <button>Downvote</button>
          </div>

          <Link href={`/post/${post?.slug}`}>
            <a>100 Comments</a>
          </Link>
        </div>
      </section>

      <section className="mt-5 bg-whiteAlt dark:bg-darkOne p-5 flex flex-col gap-2">
        <h2 className="text-md text-grayAlt">Post comment</h2>
        <textarea
          name="comment"
          id="comment"
          placeholder="What are you thoughts?"
          rows={5}
          className=" py-3 px-4 rounded-md bg-foreground text-darkTwo placeholder:text-slate-400 dark:bg-darkTwo dark:text-foreground  focus:outline-offset-2 focus:outline focus:outline-2 focus:outline-darkTwo dark:focus:outline-grayAlt transition-all overflow-hidden min-h-[100px] resize-none"
        ></textarea>
        <button className="bg-foreground text-darkTwo self-end h-12 p-4 rounded-md flex items-center disabled:opacity-50 animate-popIn active:hover:animate-none active:focus:animate-none active:focus:scale-95 active:hover:scale-95 transition-all">
          Post
        </button>
      </section>
    </div>
  );
};

export default Post;
