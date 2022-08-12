import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Head from "next/head";
import { unstable_getServerSession } from "next-auth";
import { useRouter } from "next/router";
import Link from "next/link";
import { BiErrorCircle } from "react-icons/bi";
import { authOptions } from "src/pages/api/auth/[...nextauth]";
import { AiFillHeart } from "react-icons/ai";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import MarkdownTipsModal from "@/components/common/MarkdownTipsModal";
import { trpc } from "@/utils/trpc";
import DeletePostModal from "@/components/common/DeletePostModal";
import TextareaAutosize from "@/components/common/TextareaAutosize";
import { prisma } from "../../../../../backend/client";
import CustomHead from "@/components/common/CustomHead";

type Inputs = {
  postId: string;
  postContent: string;
};

const schema = z.object({
  postId: z.string(),
  postContent: z
    .string()
    .trim()
    .max(1000, { message: "Post body must be less than 1000 characters" })
    .optional(),
});

const Edit: NextPage = ({
  isAuthor,
  post,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: { postId: post.id, postContent: post.content },
    resolver: zodResolver(schema),
  });
  const utils = trpc.useContext();
  const editMutation = trpc.useMutation("post.edit", {
    onSuccess: (data, variables, context) => {
      utils.setQueryData(
        ["post.get-by-id", { slug: data.post.slug, id: data.post.id }],
        {
          post: data.post,
        },
      );
      router.push(`/c/${post.communityName}/${post.id}/${post.slug}`);
    },
  });

  const updatePost: SubmitHandler<Inputs> = (data) => {
    editMutation.mutate({ postId: data.postId, postContent: data.postContent });
  };

  return (
    <>
      <CustomHead title={`${post.title} | Edit`} />
      <section className="w-full max-w-xl mx-auto flex flex-col gap-10">
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold">Edit Post</h1>
        </div>
        <div className="flex flex-col rounded-md">
          {editMutation.error && (
            <div className="bg-alert p-3 rounded-md text-foreground flex items-center gap-2">
              <BiErrorCircle size={22} />
              <span>Something has gone terrible wrong!</span>
            </div>
          )}

          <div className="flex justify-between items-center flex-wrap">
            <p className="mr-5 mb-2 md:mb-0">
              Posted to{" "}
              <Link href={`/c/${post.community.name}`}>
                <a
                  data-cy="post-community"
                  className="text-highlight font-semibold"
                >
                  {post.community.name}
                </a>
              </Link>{" "}
            </p>

            <div className="flex items-center gap-4 text-grayAlt">
              <div className="flex items-center gap-2">
                <span className="rounded-full p-1 bg-red-500/20 outline outline-2 outline-red-500/25 transition-all">
                  <AiFillHeart size={20} className="text-red-500" />
                </span>
                <span className="text-red-500">{post._count.likes}</span>
              </div>
              <div>
                {post._count.comments}{" "}
                {post._count.comments.length === 1 ? "comment" : "comments"}
              </div>
            </div>
          </div>

          {!isAuthor && (
            <span className="text-alert">
              Only the auther of this post can edit
            </span>
          )}

          <form
            id="edit-form"
            onSubmit={handleSubmit((data) => updatePost(data, post.id))}
            className="flex flex-col gap-5 rounded-md mt-5"
          >
            <div>
              <p className="opacity-70 border-2 focus:outline-none focus:border-grayAlt dark:focus:border-grayAlt rounded-md p-4 bg-whiteAlt text-darkTwo dark:border-darkTwo  dark:bg-darkOne dark:text-foreground cursor-not-allowed">
                {post.title}
              </p>
              {isAuthor && (
                <span className="text-grayAlt text-sm">
                  Changing post title is not supported at the moment
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <MarkdownTipsModal />
              {isAuthor ? (
                <>
                  <TextareaAutosize
                    data-cy="edit-post-body"
                    placeholder={`# Your Post \nLet the world know what you're thinking. Start with a title and then add some content to spice up your post! 😀`}
                    register={register("postContent")}
                    minHeight={250}
                  />
                  {errors.postContent?.message && (
                    <span className="text-alert">
                      {errors.postContent.message}
                    </span>
                  )}
                </>
              ) : (
                <div className="opacity-70 border-2 focus:outline-none focus:border-grayAlt dark:focus:border-grayAlt rounded-md p-4 bg-whiteAlt text-darkTwo dark:border-darkTwo  dark:bg-darkOne dark:text-foreground cursor-not-allowed min-h-[250px]">
                  {post.content}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-5">
              <DeletePostModal postId={post.id} />
              {isAuthor && (
                <button
                  data-cy="submit"
                  form="edit-form"
                  disabled={watch("postContent") === post.content}
                  className="bg-success text-whiteAlt self-end h-12 p-4 rounded-md flex items-center disabled:opacity-50 animate-popIn active:hover:animate-none active:focus:animate-none active:focus:scale-95 active:hover:scale-95 transition-all"
                >
                  Save
                </button>
              )}
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions,
  );

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const post = await prisma.post.findUnique({
    where: {
      id: context.params?.postId as string,
    },
    select: {
      id: true,
      title: true,
      content: true,
      slug: true,
      community: {
        select: {
          id: true,
          name: true,
          moderators: {
            select: {
              userId: true,
            },
          },
        },
      },
      author: {
        select: {
          id: true,
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
  });

  if (!post) {
    return {
      notFound: true,
    };
  }

  const isAuthor = post.author.id === session.user.id;
  const isModerator = post.community.moderators.some(
    (mod) => mod.userId === session.user.id,
  );
  const isAdmin = session.user.role === "ADMIN";

  if (isAuthor || isModerator || isAdmin) {
    return {
      props: {
        isAuthor,
        post,
      },
    };
  }

  return {
    redirect: {
      destination: "/",
      permanent: false,
    },
  };
};

export default Edit;
