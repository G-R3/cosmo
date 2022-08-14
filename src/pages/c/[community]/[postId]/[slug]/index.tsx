import Link from "next/link";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { BiErrorCircle } from "react-icons/bi";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { useRouter } from "next/router";
import superjson from "superjson";
import { DehydratedState } from "react-query";
import { appRouter } from "src/backend/router/_app";
import { createContext } from "src/backend/context";
import { createSSGHelpers } from "@trpc/react/ssg";
import { trpc } from "@/utils/trpc";
import Markdown from "@/components/common/Markdown";
import Comment from "@/components/common/Comment";
import CommentSkeleton from "@/components/common/CommentSkeleton";
import MarkdownTipsModal from "@/components/common/MarkdownTipsModal";
import TextareaAutosize from "@/components/common/TextareaAutosize";
import CustomHead from "@/components/common/CustomHead";
import Button from "@/components/common/Button";

type Inputs = {
  postId: string;
  commentContent: string;
};

const schema = z.object({
  postId: z.string(),
  commentContent: z
    .string()
    .trim()
    .min(1, { message: "Comment can't be empty" })
    .max(500, { message: "Comment must be less than 500 characters" }),
});

/**
 * This is cursed
 */

const Post: NextPage<{
  trpcState: DehydratedState;
  slug: string;
  postId: string;
}> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { postId, slug } = props;
  const { data: session } = useSession();
  // isValid was always returning false even when mode was set to "onChange"
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<Inputs>({
    defaultValues: { commentContent: "", postId },
    resolver: zodResolver(schema),
  });
  const utils = trpc.useContext();
  const postQuery = trpc.useQuery(["post.get-by-id", { slug, id: postId }]);
  const commentQuery = trpc.useQuery(["comment.get-by-postId", { postId }], {
    enabled: !!postQuery.data?.post.id,
  });
  const commentMutation = trpc.useMutation("comment.create", {
    onSuccess(data, variables, context) {
      utils.invalidateQueries(["post.get-by-id", { slug, id: postId }]);
      utils.invalidateQueries(["comment.get-by-postId"]);
      reset({
        commentContent: "",
        postId: postId,
      });
    },
  });

  const likeMutation = trpc.useMutation(["post.like"], {
    onMutate: async (likedPost) => {
      await utils.cancelQuery(["post.get-by-id", { slug, id: postId }]);
      const previousData = utils.getQueryData([
        "post.get-by-id",
        { slug, id: postId },
      ]);

      if (previousData) {
        utils.setQueryData(["post.get-by-id", { slug, id: postId }], {
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
          ["post.get-by-id", { slug, id: postId }],
          context?.previousData,
        );
      }
    },
  });
  const unlikeMutation = trpc.useMutation(["post.unlike"], {
    onMutate: async (unLikedPost) => {
      await utils.cancelQuery(["post.get-by-id", { slug, id: postId }]);
      const previousData = utils.getQueryData([
        "post.get-by-id",
        { slug, id: postId },
      ]);

      if (previousData) {
        utils.setQueryData(["post.get-by-id", { slug, id: postId }], {
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
          ["post.get-by-id", { slug, id: postId }],
          context?.previousData,
        );
      }
    },
  });

  const saveMutation = trpc.useMutation(["post.save"], {
    onMutate: async (savedPost) => {
      await utils.cancelQuery(["post.get-by-id", { slug, id: postId }]);
      const previousData = utils.getQueryData([
        "post.get-by-id",
        { slug, id: postId },
      ]);

      if (previousData) {
        utils.setQueryData(["post.get-by-id", { slug, id: postId }], {
          ...previousData,
          post: {
            ...previousData.post,
            savedBy: [
              ...previousData.post.savedBy,
              {
                userId: session?.user.id!,
                postId: savedPost.postId,
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
          ["post.get-by-id", { slug, id: postId }],
          context?.previousData,
        );
      }
    },
  });
  const unSaveMutation = trpc.useMutation(["post.unsave"], {
    onMutate: async (unSavedPost) => {
      await utils.cancelQuery(["post.get-by-id", { slug, id: postId }]);
      const previousData = utils.getQueryData([
        "post.get-by-id",
        { slug, id: postId },
      ]);

      if (previousData) {
        utils.setQueryData(["post.get-by-id", { slug, id: postId }], {
          ...previousData,
          post: {
            ...previousData.post,
            savedBy: previousData.post.savedBy.filter(
              (save) => save.userId !== session?.user.id!,
            ),
          },
        });
      }

      return { previousData };
    },
    onError: (err, data, context) => {
      if (context?.previousData) {
        utils.setQueryData(
          ["post.get-by-id", { slug, id: postId }],
          context?.previousData,
        );
      }
    },
  });

  if (postQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (postQuery.error) {
    return <div>No post was found</div>;
  }

  if (!postQuery.data) {
    return <div>There doesn&apos;t seem be anything here.</div>;
  }

  const createComment: SubmitHandler<Inputs> = (data) => {
    commentMutation.mutate({
      postId: data.postId,
      content: data.commentContent,
    });
  };

  const onLike = (postId: string) => {
    likeMutation.mutate({ postId });
  };
  const onUnlike = (postId: string) => {
    unlikeMutation.mutate({ postId });
  };
  const onSave = (postId: string) => {
    saveMutation.mutate({ postId });
  };
  const onUnsave = (postId: string) => {
    unSaveMutation.mutate({ postId });
  };

  const isLikedByUser = postQuery.data.post.likes.find(
    (like) => like.userId === session?.user.id,
  );
  const isSavedByUser = postQuery.data.post.savedBy.find(
    (save) => save.userId === session?.user.id,
  );
  const isAuthorMod = postQuery.data.post.community.moderators.some(
    (mod) => mod.userId === postQuery.data.post.author.id,
  );
  const isAuthorAdmin = postQuery.data.post.author.role === "ADMIN";
  const isPostAuthor = postQuery.data.post.author.id === session?.user.id;
  const isModerator = postQuery.data.post.community.moderators.some(
    (mod) => mod.userId === session?.user.id,
  );
  const isAdmin = session?.user.role === "ADMIN";

  return (
    <>
      <CustomHead
        title={`${postQuery.data.post.title} | ${postQuery.data.post.community.name}`}
      />

      <div className="max-w-3xl mx-auto">
        {(!!likeMutation.error || !!unlikeMutation.error) && (
          <div
            data-cy="alert-alert"
            className="bg-alert p-3 rounded-md text-foreground flex items-center gap-2"
          >
            <BiErrorCircle size={22} />
            <span>Failed to like the post</span>
          </div>
        )}
        <section className="p-5 bg-whiteAlt dark:bg-darkOne rounded-md">
          <h1 className="text-2xl">{postQuery.data.post.title}</h1>

          <div className="mb-3 text-grayAlt">
            <span>
              Posted to{" "}
              <Link href={`/c/${postQuery.data.post.community.name}`}>
                <a className="text-highlight font-semibold">
                  {postQuery.data.post.community.name}
                </a>
              </Link>{" "}
              by{" "}
            </span>
            <span>
              <Link href={`/user/${postQuery.data.post.author.id}`}>
                <a className="text-darkOne dark:text-foreground hover:underline hover:underline-offset-1">
                  {postQuery.data.post.author.name}
                </a>
              </Link>
              {isAuthorAdmin ? (
                <span className="text-xs text-highlight font-bold">
                  {" "}
                  ADMIN{" "}
                </span>
              ) : isAuthorMod ? (
                <span className="text-xs text-green-500 font-bold"> MOD </span>
              ) : null}
            </span>
            10 hrs ago
          </div>

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
              <button
                onClick={
                  isSavedByUser
                    ? () => onUnsave(postQuery.data.post.id)
                    : () => onSave(postQuery.data.post.id)
                }
                // disabled={
                //   unSavePostMutation.isLoading || savePostMutation.isLoading
                // }
                className="flex items-center gap-[6px] hover:text-whiteAlt focus:text-whiteAlt transition-colors"
              >
                {isSavedByUser ? <BsBookmarkFill /> : <BsBookmark />}
                {isSavedByUser ? "Unsave" : "Save"}
              </button>
              {(isPostAuthor || isModerator || isAdmin) && (
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
                {postQuery.data.post._count.comments}{" "}
                {postQuery.data.post._count.comments === 1
                  ? "comment"
                  : "comments"}
              </span>
            </div>
          </div>
        </section>

        <section className="mt-5 bg-whiteAlt dark:bg-darkOne p-5 rounded-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <h2 className="text-lg">Post a comment</h2>
            {commentMutation.error?.data && (
              <div
                data-cy="alert-error"
                className="bg-alert p-3 rounded-md text-foreground flex items-center gap-2"
              >
                <BiErrorCircle size={22} />
                <span>
                  {
                    commentMutation.error.data.zodError?.fieldErrors
                      .content?.[0]
                  }
                </span>
              </div>
            )}
          </div>
          <form
            id="createComment"
            className="flex flex-col gap-2 mb-3"
            onSubmit={handleSubmit(createComment)}
          >
            <div className="flex justify-between items-center flex-wrap">
              <MarkdownTipsModal />
              {errors.commentContent?.message && (
                <span data-cy="form-error" className="text-alert">
                  {errors.commentContent.message}
                </span>
              )}
            </div>
            <TextareaAutosize
              data-cy="comment-textarea"
              id="comment"
              placeholder="What are you thoughts?"
              minHeight={200}
              register={register("commentContent")}
            />
          </form>
          <div className="flex justify-end">
            {session?.user ? (
              <Button
                form="createComment"
                data-cy="create-comment"
                variant="primary"
                size="md"
                loading={commentMutation.isLoading}
                disabled={!isDirty || !!errors.commentContent}
              >
                Post
              </Button>
            ) : (
              // TODO: Add login modal. it sucks having to redirect to login page.
              <Button
                onClick={() => router.push("/signin")}
                loading={commentMutation.isLoading}
                disabled={!isDirty || !!errors.commentContent}
                variant="primary"
                size="md"
              >
                Post
              </Button>
            )}
          </div>
        </section>

        <section className="mt-5 rounded-md py-5 flex flex-col gap-5">
          {commentQuery.isLoading &&
            Array(13)
              .fill(0)
              .map((skeleton, idx) => <CommentSkeleton key={idx} />)}
          {commentQuery.data?.comments.map((comment) => (
            // TODO: move isMod, isAdmin check to api layer maybe? if not maybe move them to the
            // comment component similarly to how we're doing it on the Post component
            <Comment
              key={comment.id}
              {...comment}
              isCommentAuthor={comment.author.id === session?.user.id}
              isCommentAuthorMod={postQuery.data.post.community.moderators.some(
                (mod) => mod.userId === comment.author.id,
              )}
              isModerator={isModerator}
              isAdmin={isAdmin}
            />
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

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const ssg = await createSSGHelpers({
    router: appRouter,
    ctx: await createContext(),
    transformer: superjson,
  });

  const postId = context.params?.postId as string;
  const slug = context.params?.slug as string;

  await ssg.fetchQuery("post.get-by-id", { slug, id: postId });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      slug,
      postId,
    },
  };
};

export default Post;
