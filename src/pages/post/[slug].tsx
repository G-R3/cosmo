import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import Markdown from "../../components/Markdown";
import Comment from "../../components/Comment";
import { BiErrorCircle } from "react-icons/bi";
import useTextarea from "../../hooks/useTextarea";

const Post = () => {
  const router = useRouter();
  const utils = trpc.useContext();
  const { content, setContent, textareaRef } = useTextarea("");
  const slug = router.query.slug as string;

  const postQuery = trpc.useQuery(["post.get", { slug }], {
    refetchOnWindowFocus: false,
  });

  const commentMutation = trpc.useMutation("comment.create", {
    onSuccess: (input) => {
      utils.invalidateQueries(["post.get"]);
    },
  });

  const voteMutation = trpc.useMutation("vote.create", {
    onSuccess(data, variables, context) {
      utils.invalidateQueries("post.get");
    },
  });

  if (postQuery.isLoading) {
    return <div className="text-center text-xl font-semibold">Loading...</div>;
  }

  if (postQuery.error) {
    return (
      <div className="text-center text-xl font-semibold">
        Error grabbing post
      </div>
    );
  }

  const handleSubmit = (e: any, postId: number, comment: string) => {
    commentMutation.mutate({
      content: comment,
      postId,
    });

    setContent("");
  };

  const handleVote = (vote: number, postId: number) => {
    voteMutation.mutate({ voteType: vote, postId });
  };
  const { data: post } = postQuery;

  if (!post) {
    // this will crash if we try to visit a post that does not exist
    // Objects are not valid as a React child. Figure out a way to redirect if post does not exist
    // return router.push("/");
    return (
      <div className="text-center text-xl font-semibold">No post found</div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {voteMutation.error && (
        <div
          data-cy="alert-error"
          className="bg-error p-3 rounded-md text-foreground flex items-center gap-2"
        >
          <BiErrorCircle size={22} />
          <span>Unable to vote on post!</span>
        </div>
      )}
      <section className="p-5 bg-whiteAlt dark:bg-darkOne">
        <h1 className="text-2xl">{post?.title}</h1>
        <small className="mb-3 mt-1 block text-grayAlt">
          Posted by {post?.user.name} 10 hours ago
        </small>
        <Markdown content={post?.content ? post.content : ""} />
        <div className="flex justify-between mt-3 text-grayAlt">
          <div className="flex justify-center items-center gap-2">
            <button
              data-cy="upvote-post"
              onClick={() => handleVote(1, post.id)}
              className={`rounded-md p-1 text-xs ${
                post.hasVoted?.voteType === 1 && "bg-orange-500 text-whiteAlt"
              }`}
            >
              Upvote
            </button>
            <span
              data-cy="post-votes"
              className="text-base border px-2 rounded-full"
            >
              {post.totalVotes}
            </span>
            <button
              data-cy="downvote-post"
              onClick={() => handleVote(-1, post.id)}
              className={`rounded-md p-1 text-xs ${
                post.hasVoted?.voteType === -1 && "bg-indigo-400 text-whiteAlt"
              }`}
            >
              Downvote
            </button>
          </div>

          <span>
            {post?.comments.length}{" "}
            {post?.comments.length > 1 || post?.comments.length === 0
              ? "comments"
              : "comment"}
          </span>
        </div>
      </section>

      <section className="mt-5 bg-whiteAlt dark:bg-darkOne p-5 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-md text-grayAlt">Post comment</h2>
          {commentMutation.error && (
            <div
              data-cy="alert-error"
              className="bg-error p-3 rounded-md text-foreground flex items-center gap-2"
            >
              <BiErrorCircle size={22} />
              <span>Something has gone terrible wrong!</span>
            </div>
          )}
        </div>
        <textarea
          data-cy="comment-textarea"
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          name="comment"
          id="comment"
          placeholder="What are you thoughts?"
          rows={5}
          className=" py-3 px-4 rounded-md bg-foreground text-darkTwo placeholder:text-slate-400 dark:bg-darkTwo dark:text-foreground  focus:outline-offset-2 focus:outline focus:outline-2 focus:outline-darkTwo dark:focus:outline-grayAlt transition-all overflow-hidden min-h-[200px] resize-none"
        ></textarea>
        <button
          disabled={commentMutation.isLoading}
          onClick={(e) => handleSubmit(e, post?.id, content)}
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
