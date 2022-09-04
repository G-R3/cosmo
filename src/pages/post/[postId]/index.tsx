import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { BiErrorCircle } from "react-icons/bi";
import { AiFillHeart, AiOutlineComment, AiOutlineHeart } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import Markdown from "@/components/common/Markdown";
import Comment from "@/components/common/Comment";
import CommentSkeleton from "@/components/common/CommentSkeleton";
import CustomHead from "@/components/common/CustomHead";
import Alert from "@/components/common/Alert";
import Preloader from "@/components/common/Preloader";
import spaceTwo from "../../../assets/space-2.svg";
import NotFound from "@/components/common/NotFound";
import CreateCommentForm from "@/components/post/CreateCommentForm";
import ButtonLink from "@/components/common/ButtonLink";
import clx from "@/lib/classnames";
import useIsMobile from "@/hooks/useIsMobile";

const Post: NextPage = () => {
  const router = useRouter();
  const id = router.query.postId as string;
  const { data: session } = useSession();
  const isMobile = useIsMobile();
  const utils = trpc.useContext();
  const postQuery = trpc.useQuery(["post.get-by-id", { id }], {
    refetchOnWindowFocus: false,
  });
  const commentQuery = trpc.useQuery(
    ["comment.get-by-postId", { postId: id }],
    {
      enabled: !!id,
    },
  );

  const likeMutation = trpc.useMutation(["post.like"], {
    onMutate: async (likedPost) => {
      await utils.cancelQuery(["post.get-by-id", { id }]);
      const previousData = utils.getQueryData(["post.get-by-id", { id }]);

      if (previousData) {
        utils.setQueryData(["post.get-by-id", { id }], {
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
        utils.setQueryData(["post.get-by-id", { id }], context?.previousData);
      }
    },
  });
  const unlikeMutation = trpc.useMutation(["post.unlike"], {
    onMutate: async (unLikedPost) => {
      await utils.cancelQuery(["post.get-by-id", { id }]);
      const previousData = utils.getQueryData(["post.get-by-id", { id }]);

      if (previousData) {
        utils.setQueryData(["post.get-by-id", { id }], {
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
        utils.setQueryData(["post.get-by-id", { id }], context?.previousData);
      }
    },
  });

  const saveMutation = trpc.useMutation(["post.save"], {
    onMutate: async (savedPost) => {
      await utils.cancelQuery(["post.get-by-id", { id }]);
      const previousData = utils.getQueryData(["post.get-by-id", { id }]);

      if (previousData) {
        utils.setQueryData(["post.get-by-id", { id }], {
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
        utils.setQueryData(["post.get-by-id", { id }], context?.previousData);
      }
    },
  });
  const unSaveMutation = trpc.useMutation(["post.unsave"], {
    onMutate: async (unSavedPost) => {
      await utils.cancelQuery(["post.get-by-id", { id }]);
      const previousData = utils.getQueryData(["post.get-by-id", { id }]);

      if (previousData) {
        utils.setQueryData(["post.get-by-id", { id }], {
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
        utils.setQueryData(["post.get-by-id", { id }], context?.previousData);
      }
    },
  });

  if (postQuery.isLoading) {
    return <Preloader />;
  }

  if (postQuery.error || !postQuery.data) {
    return (
      <div className="flex justify-center">
        <div className="flex flex-col gap-5 justify-center items-center">
          <NotFound
            heading="Ooops"
            text="It seems this post has been lost. Try again or check back later."
          />
          <ButtonLink href="/" variant="primary">
            Return home
          </ButtonLink>
        </div>
      </div>
    );
  }

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
        {/* TODO: use toasts for like/unlike and save/unsave errors */}
        {(!!likeMutation.error || !!unlikeMutation.error) && (
          <Alert type="error">
            <BiErrorCircle size={22} />
            <span>Oh snap! something went wrong</span>
          </Alert>
        )}
        <div className="p-5 bg-whiteAlt dark:bg-darkOne rounded-md">
          <section className="">
            <h1 data-cy="post-title" className="text-2xl">
              {postQuery.data.post.title}
            </h1>

            <div className="mb-3 text-grayAlt text-xs">
              Posted to{" "}
              <Link href={`/community/${postQuery.data.post.community.name}`}>
                <a
                  data-cy="post-community"
                  className="text-highlight font-semibold"
                >
                  {postQuery.data.post.community.name}
                </a>
              </Link>{" "}
              by{" "}
              <Link href={`/user/${postQuery.data.post.author.id}`}>
                <a className="text-darkOne dark:text-foreground hover:underline hover:underline-offset-1">
                  {postQuery.data.post.author.name}{" "}
                </a>
              </Link>
              {isAuthorAdmin ? (
                <span className="text-highlight font-bold"> ADMIN </span>
              ) : isAuthorMod ? (
                <span className="text-xs text-green-500 font-bold"> MOD </span>
              ) : null}
              10 hrs ago
            </div>

            <div className="mt-6 mb-10">
              <Markdown
                content={
                  postQuery.data.post.content ? postQuery.data.post.content : ""
                }
              />
            </div>

            <div className="text-sm font-semibold flex justify-between mt-3">
              <button
                data-cy="like-post"
                onClick={
                  isLikedByUser
                    ? () => onUnlike(postQuery.data.post.id)
                    : () => onLike(postQuery.data.post.id)
                }
                className="flex justify-center items-center gap-2 py-1 px-2 text-grayAlt group rounded hover:bg-red-500/20 focus-visible:bg-red-500/20 focus:outline-none transition-colors"
              >
                {isLikedByUser ? (
                  <span>
                    <AiFillHeart
                      size={16}
                      className={clx(isLikedByUser && "text-red-500")}
                    />
                  </span>
                ) : (
                  <span>
                    <AiFillHeart
                      size={16}
                      className="group-hover:text-red-500 transition-colors"
                    />
                  </span>
                )}
                <span
                  data-cy="likes"
                  className={clx(
                    "group-hover:text-red-500 transition-all",
                    isLikedByUser && "text-red-500",
                  )}
                >
                  {postQuery.data.post.likes.length}
                </span>
              </button>

              <div className="flex items-center gap-2 text-grayAlt">
                <button
                  onClick={
                    isSavedByUser
                      ? () => onUnsave(postQuery.data.post.id)
                      : () => onSave(postQuery.data.post.id)
                  }
                  className="flex items-center gap-2 py-1 px-2 rounded group hover:bg-foreground hover:text-darkOne hover:dark:bg-secondary hover:dark:text-whiteAlt/80 focus-visible:bg-foreground focus-visible:text-darkOne focus-visible:dark:text-whiteAlt/80 focus-visible:dark:bg-secondary focus:outline-none transition-colors"
                >
                  {isSavedByUser ? (
                    <BsBookmarkFill size={16} />
                  ) : (
                    <BsBookmark size={16} />
                  )}
                  {!isMobile && <>{isSavedByUser ? "Unsave" : "Save"}</>}
                </button>
                {(isPostAuthor || isModerator || isAdmin) && (
                  <Link href={`/post/${postQuery.data.post.id}/edit`}>
                    <a
                      data-cy="post-edit-link"
                      className="py-1 px-2 flex items-center gap-2 rounded hover:bg-blue-400/20 hover:text-blue-400 focus-visible:bg-blue-400/20 focus-visible:text-blue-400 focus:outline-none transition-colors"
                    >
                      <FiEdit2 size={16} />
                      {!isMobile && "Edit"}
                    </a>
                  </Link>
                )}
                <span className="flex items-center gap-2 py-1 px-2 rounded hover:bg-foreground hover:text-darkOne hover:dark:bg-secondary hover:dark:text-whiteAlt/80 focus-visible:bg-foreground focus-visible:text-darkOne focus-visible:dark:text-whiteAlt/80 focus-visible:dark:bg-secondary focus:outline-none transition-colors">
                  <AiOutlineComment size={18} />
                  {postQuery.data.post._count.comments}{" "}
                  {!isMobile && (
                    <>
                      {postQuery.data.post._count.comments === 1
                        ? "comment"
                        : "comments"}
                    </>
                  )}
                </span>
              </div>
            </div>
          </section>
          <CreateCommentForm postId={id} />
        </div>

        <section className="rounded-md flex flex-col gap-3 mt-6">
          {commentQuery.isLoading &&
            Array(13)
              .fill(0)
              .map((skeleton, idx) => <CommentSkeleton key={idx} />)}
          {commentQuery.data?.comments.map((comment) => (
            <Comment
              key={comment.id}
              {...comment}
              isAuthorMod={postQuery.data.post.community.moderators.some(
                (mod) => mod.userId === comment.author.id,
              )}
              isModerator={postQuery.data.post.community.moderators.some(
                (mod) => mod.userId === session?.user.id,
              )}
            />
          ))}
          {commentQuery.data?.comments.length === 0 && (
            <div className="flex flex-col justify-center items-center">
              <Image src={spaceTwo} alt="Space Illustration" />
              <div className="flex flex-col justify-center items-center max-w-lg mx-auto -mt-3">
                <h1 className="text-highlight font-bold text-3xl text-center">
                  Woah!
                </h1>
                <p className="text-lg text-grayAlt">Its sure is empty here</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default Post;
