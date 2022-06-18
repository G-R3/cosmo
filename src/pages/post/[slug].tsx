import Link from "next/link";
import { useRouter } from "next/router";
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
      <section className="p-5 bg-neutral">
        <h1 className="text-2xl">{post?.title}</h1>
        <small className="mb-3">Post by Tuxedoed 10 hours ago</small>
        <p className="mt-5 mb-10">{post?.content}</p>
        <div className="flex justify-between mt-3">
          <div className="flex justify-center items-center gap-2">
            <button>Upvote</button>
            <span>Vote</span>
            <button>Downvote</button>
          </div>

          <Link href={`/post/${post.slug}`}>
            <a>100 Comments</a>
          </Link>
        </div>
      </section>

      <section className="mt-5 bg-neutral p-5 flex flex-col gap-2">
        <h2 className="text-md">Post comment</h2>
        <textarea
          name="comment"
          id="comment"
          placeholder="What are you thoughts?"
          rows={5}
          className="textarea textarea-bordered rounded-md overflow-hidden min-h-[100px] resize-none"
        ></textarea>
        <button className="btn btn-primary self-end rounded-md">Post</button>
      </section>
    </div>
  );
};

export default Post;
