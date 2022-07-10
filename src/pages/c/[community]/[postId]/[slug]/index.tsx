import { useRouter } from "next/router";
import Link from "next/link";
import React from "react";
import { BiErrorCircle } from "react-icons/bi";
import { trpc } from "../../../../../utils/trpc";
import Markdown from "../../../../../components/Markdown";
import Comment from "../../../../../components/Comment";
import useTextarea from "../../../../../hooks/useTextarea";
import { useSession } from "next-auth/react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

const Post = () => {
  const { data: session } = useSession();
  const slug = useRouter().query.slug as string;
  const postId = useRouter().query.postId;
  const { content, setContent, textareaRef } = useTextarea("");
  const utils = trpc.useContext();
  const postQuery = trpc.useQuery(
    ["post.get-by-id", { slug, id: Number(postId) }],
    {
      refetchOnWindowFocus: false,
    },
  );
  const commentMutation = trpc.useMutation("comment.create");

  const likeMutation = trpc.useMutation(["post.like"], {
    // optimistic update
    // I still don't quite get this but it sounded like what i needed.
    // https://tanstack.com/query/v4/docs/guides/optimistic-updates
    onMutate: async (likedPost) => {
      await utils.cancelQuery(["post.get-by-id", { slug, id: Number(postId) }]);
      const previousData = utils.getQueryData([
        "post.get-by-id",
        { slug, id: Number(postId) },
      ]);

      if (previousData) {
        utils.setQueryData(["post.get-by-id", { slug, id: Number(postId) }], {
          ...previousData,
          post: {
            ...previousData.post,
            likes: [
              ...previousData.post.likes,
              {
                userId: session?.user.id!,
                postId: likedPost.postId,
              },
            ],
          },
        });
      }

      return { previousData };
    },
    onError: (err, data, context) => {
      if (context?.previousData) {
        utils.setQueryData(
          ["post.get-by-id", { slug, id: Number(postId) }],
          context?.previousData,
        );
      }
    },
  });

  const unlikeMutation = trpc.useMutation(["post.unlike"], {
    onMutate: async (unLikedPost) => {
      await utils.cancelQuery(["post.get-by-id", { slug, id: Number(postId) }]);
      const previousData = utils.getQueryData([
        "post.get-by-id",
        { slug, id: Number(postId) },
      ]);

      if (previousData) {
        utils.setQueryData(["post.get-by-id", { slug, id: Number(postId) }], {
          ...previousData,
          post: {
            ...previousData.post,
            likes: previousData.post.likes.filter(
              (like) => like.userId !== session?.user.id!,
            ),
          },
        });
      }

      return { previousData };
    },
    onError: (err, data, context) => {
      if (context?.previousData) {
        utils.setQueryData(
          ["post.get-by-id", { slug, id: Number(postId) }],
          context?.previousData,
        );
      }
    },
  });

  if (postQuery.error) {
    return <div>No post was found</div>;
  }

  if (postQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (!postQuery.data) {
    return <div>There doesn&apos;t seem be anything here.</div>;
  }

  const handleSubmit = (e: any, postId: number, comment: string) => {
    commentMutation.mutate({
      content: comment,
      postId,
    });

    setContent("");
  };

  const onLike = (postId: number) => {
    likeMutation.mutate({ postId });
  };
  const onUnlike = (postId: number) => {
    unlikeMutation.mutate({ postId });
  };

  const isLikedByUser = postQuery.data.post.likes.find(
    (like) => like.userId === session?.user.id,
  );

  return (
    <>
      <div className="max-w-3xl mx-auto">
        {!!likeMutation.error ||
          (!!unlikeMutation.error && (
            <div
              data-cy="alert-error"
              className="bg-error p-3 rounded-md text-foreground flex items-center gap-2"
            >
              <BiErrorCircle size={22} />
              <span>Failed to like the post</span>
            </div>
          ))}
        <section className="p-5 bg-whiteAlt dark:bg-darkOne">
          <h1 className="text-2xl">{postQuery.data.post.title}</h1>
          <small>
            Posted to{" "}
            <Link href={`/c/${postQuery.data.post.community.name}`}>
              <a
                data-cy="post-community"
                className="text-highlight font-semibold"
              >
                {postQuery.data.post.community.name}
              </a>
            </Link>{" "}
            by {postQuery.data.post.user.name} 10 hrs ago
          </small>

          <Markdown
            content={
              postQuery.data.post.content ? postQuery.data.post.content : ""
            }
          />
          <div className="flex justify-between mt-3 text-grayAlt">
            <button
              data-cy="like-post"
              onClick={
                isLikedByUser
                  ? () => onUnlike(postQuery.data.post.id)
                  : () => onLike(postQuery.data.post.id)
              }
              className="flex justify-center items-center gap-2 text-grayAlt px-3"
            >
              {isLikedByUser ? (
                <AiFillHeart size={20} />
              ) : (
                <AiOutlineHeart size={20} />
              )}
              {postQuery.data.post.likes.length}
            </button>
            <span>
              {postQuery.data.post.comments.length}{" "}
              {(postQuery.data.post.comments &&
                postQuery.data.post.comments.length > 1) ||
              postQuery.data.post.comments.length === 0
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
            data-cy="create-comment"
            disabled={commentMutation.isLoading}
            onClick={(e) => handleSubmit(e, postQuery.data.post?.id, content)}
            className="bg-foreground text-darkTwo self-end h-12 p-4 rounded-md flex items-center disabled:opacity-50 disabled:scale-95 animate-popIn active:hover:animate-none active:focus:animate-none active:focus:scale-95 active:hover:scale-95 transition-all focus-visible:focus:outline focus-visible:focus:outline-[3px] focus-visible:focus:outline-highlight"
          >
            Post
          </button>
        </section>

        <section className="mt-5 rounded-md py-5 flex flex-col gap-5">
          {postQuery.data.post.comments &&
          postQuery.data.post.comments.length > 0 ? (
            postQuery.data.post.comments.map((comment) => (
              <Comment key={comment.id} {...comment} />
            ))
          ) : (
            <div className="flex flex-col justify-center items-center">
              <p className="font-bold text-lg text-center mt-6">
                Its empty here
              </p>
              <p className="text-xl">😢</p>
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default Post;