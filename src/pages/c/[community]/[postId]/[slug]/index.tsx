import { useRouter } from "next/router";
import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { BiErrorCircle } from "react-icons/bi";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { trpc } from "@/utils/trpc";
import Markdown from "@/components/Markdown";
import Comment from "@/components/Comment";
import useTextarea from "@/hooks/useTextarea";
import CommentSkeleton from "@/components/CommentSkeleton";
import MarkdownTipsModal from "@/components/MarkdownTipsModal";
import { FiEdit2 } from "react-icons/fi";

const Post = () => {
  const router = useRouter();
  const slug = router.query.slug as string;
  const postId = router.query.postId;
  const { data: session } = useSession();
  const { content, setContent, textareaRef } = useTextarea("", 100);
  const utils = trpc.useContext();
  const postQuery = trpc.useQuery([
    "post.get-by-id",
    { slug, id: Number(postId) },
  ]);
  const commentQuery = trpc.useQuery(
    ["comment.get-by-postId", { postId: Number(postQuery.data?.post.id) }],
    {
      enabled: !!postQuery.data?.post.id,
    },
  );
  const commentMutation = trpc.useMutation("comment.create");

  const likeMutation = trpc.useMutation(["post.like"], {
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
              data-cy="alert-alert"
              className="bg-alert p-3 rounded-md text-foreground flex items-center gap-2"
            >
              <BiErrorCircle size={22} />
              <span>Failed to like the post</span>
            </div>
          ))}
        <section className="p-5 bg-whiteAlt dark:bg-darkOne rounded-md">
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
            by {postQuery.data.post.author.name} 10 hrs ago
          </small>

          <div className="mt-6 mb-10">
            <Markdown
              content={
                postQuery.data.post.content ? postQuery.data.post.content : ""
              }
            />
          </div>

          <div className="flex justify-between mt-3">
            <button
              data-cy="like-post"
              onClick={
                isLikedByUser
                  ? () => onUnlike(postQuery.data.post.id)
                  : () => onLike(postQuery.data.post.id)
              }
              className="flex justify-center items-center gap-2 text-grayAlt group"
            >
              {isLikedByUser ? (
                <span className="rounded-full p-1 group-hover:bg-red-500/20 group-hover:outline outline-2 outline-red-500/25 transition-all">
                  <AiFillHeart
                    size={20}
                    className={`${isLikedByUser ? "text-red-500" : ""}`}
                  />
                </span>
              ) : (
                <span className="rounded-full p-1 group-hover:bg-red-500/20 group-hover:outline outline-2 outline-red-500/25 transition-all">
                  <AiOutlineHeart size={20} />
                </span>
              )}
              <span className={`${isLikedByUser ? "text-red-500" : ""}`}>
                {postQuery.data.post.likes.length}
              </span>
            </button>

            <div className="flex items-center gap-3 text-grayAlt">
              {postQuery.data.post.author.id === session?.user.id && (
                <Link
                  href={`/c/${postQuery.data.post.community.name}/${postQuery.data.post.id}/${postQuery.data.post.slug}/edit`}
                >
                  <a
                    data-cy="post-edit-link"
                    className="py-1 px-2 flex items-center gap-[6px] hover:text-blue-400 focus:text-blue-400"
                  >
                    <FiEdit2 />
                    Edit
                  </a>
                </Link>
              )}
              <span>
                {postQuery.data.post.commentCount}{" "}
                {postQuery.data.post.commentCount === 1
                  ? "comment"
                  : "comments"}
              </span>
            </div>
          </div>
        </section>

        <section className="mt-5 bg-whiteAlt dark:bg-darkOne p-5 flex flex-col gap-2 rounded-md">
          <div className="flex items-center justify-between">
            <h2 className="text-lg">Post a comment</h2>
            {commentMutation.error && (
              <div
                data-cy="alert-error"
                className="bg-alert p-3 rounded-md text-foreground flex items-center gap-2"
              >
                <BiErrorCircle size={22} />
                <span>Something has gone terrible wrong!</span>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 mb-3">
            <MarkdownTipsModal />
            <textarea
              data-cy="comment-textarea"
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              name="comment"
              id="comment"
              placeholder="What are you thoughts?"
              rows={5}
              className=" py-3 px-4 border-2 focus:outline-none focus:border-grayAlt dark:focus:border-grayAlt rounded-md bg-whiteAlt dark:border-darkTwo text-darkTwo placeholder:text-grayAlt dark:bg-darkOne dark:text-foreground overflow-hidden resize-none"
            ></textarea>
          </div>
          <button
            data-cy="create-comment"
            disabled={commentMutation.isLoading}
            onClick={(e) => handleSubmit(e, postQuery.data.post?.id, content)}
            className="bg-whiteAlt border-2 text-darkTwo self-end h-12 p-4 rounded-md flex items-center disabled:opacity-50 disabled:scale-95 animate-popIn active:hover:animate-none active:focus:animate-none active:focus:scale-95 active:hover:scale-95 transition-all focus-visible:focus:outline focus-visible:focus:outline-[3px] focus-visible:focus:outline-highlight"
          >
            Post
          </button>
        </section>

        <section className="mt-5 rounded-md py-5 flex flex-col gap-5">
          {commentQuery.isLoading &&
            Array(13)
              .fill(0)
              .map((skeleton, idx) => <CommentSkeleton key={idx} />)}
          {commentQuery.data?.comments.map((comment) => (
            <Comment key={comment.id} {...comment} />
          ))}
          {commentQuery.data?.comments.length === 0 && (
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
