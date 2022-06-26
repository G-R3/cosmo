import Link from "next/link";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import Markdown from "../../components/Markdown";
import Comment from "../../components/Comment";
import { useState } from "react";
import { BiErrorCircle } from "react-icons/bi";
import { motion } from "framer-motion";

const Post = () => {
  const router = useRouter();
  const [comment, setComment] = useState("");
  const utils = trpc.useContext();

  const slug = router.query.slug as string;
  const postQuery = trpc.useQuery(["post.get", { slug }], {
    refetchOnWindowFocus: false,
  });
  const mutation = trpc.useMutation("comment.create", {
    onSuccess: (input) => {
      utils.invalidateQueries(["post.get"]);
    },
  });

  if (postQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (postQuery.error) {
    return <div>Error grabbing post</div>;
  }

  const handleSubmit = (e: any, postId: number, comment: string) => {
    mutation.mutate({
      content: comment,
      postId,
    });

    setComment("");
  };

  const { data: post } = postQuery;

  if (!post) {
    // this will crash if we try to visit a post that does not exist
    // Objects are not valid as a React child. Figure out a way to redirect if post does not exist
    return router.push("/");
  }

  return (
    <div className="max-w-3xl mx-auto">
      <section className="p-5 bg-whiteAlt dark:bg-darkOne">
        <h1 className="text-2xl">{post?.title}</h1>
        <small className="mb-3 mt-1 block text-grayAlt">
          Posted by {post?.user.name} 10 hours ago
        </small>
        <Markdown content={post?.content ? post.content : ""} />
        <div className="flex justify-between mt-3 text-grayAlt">
          <div className="flex justify-center items-center gap-2">
            <button>Upvote</button>
            <span>0</span>
            <button>Downvote</button>
          </div>

          <Link href={`/post/${post?.slug}`}>
            <a>0 Comments</a>
          </Link>
        </div>
      </section>

      <section className="mt-5 bg-whiteAlt dark:bg-darkOne p-5 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-md text-grayAlt">Post comment</h2>
          {mutation.error && (
            <div className="bg-error p-3 rounded-md text-foreground flex items-center gap-2">
              <BiErrorCircle size={22} />
              <span>Something has gone terrible wrong!</span>
            </div>
          )}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          name="comment"
          id="comment"
          placeholder="What are you thoughts?"
          rows={5}
          className=" py-3 px-4 rounded-md bg-foreground text-darkTwo placeholder:text-slate-400 dark:bg-darkTwo dark:text-foreground  focus:outline-offset-2 focus:outline focus:outline-2 focus:outline-darkTwo dark:focus:outline-grayAlt transition-all overflow-hidden min-h-[100px] resize-none"
        ></textarea>
        <button
          disabled={mutation.isLoading}
          onClick={(e) => handleSubmit(e, post?.id, comment)}
          className="bg-foreground text-darkTwo self-end h-12 p-4 rounded-md flex items-center disabled:opacity-50 disabled:scale-95 animate-popIn active:hover:animate-none active:focus:animate-none active:focus:scale-95 active:hover:scale-95 transition-all focus-visible:focus:outline focus-visible:focus:outline-[3px] focus-visible:focus:outline-highlight"
        >
          Post
        </button>
      </section>

      <section className="mt-5 rounded-md py-5 flex flex-col gap-5">
        {post.comments.length > 0 ? (
          post.comments.map((comment) => (
            <Comment key={comment.id} {...comment} />
          ))
        ) : (
          <div className="flex flex-col justify-center items-center">
            <p className="font-bold text-lg text-center mt-6">Its empty here</p>
            <p className="text-xl">😢</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Post;
