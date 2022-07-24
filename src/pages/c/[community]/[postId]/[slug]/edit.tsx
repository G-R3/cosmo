import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { unstable_getServerSession } from "next-auth";
import { useRouter } from "next/router";
import Link from "next/link";
import { BiErrorCircle } from "react-icons/bi";
import { authOptions } from "src/pages/api/auth/[...nextauth]";
import { AiFillHeart } from "react-icons/ai";
import MarkdownTipsModal from "@/components/MarkdownTipsModal";
import { trpc } from "@/utils/trpc";
import DeletePostModal from "@/components/DeletePostModal";
import TextareaAutosize from "@/components/TextareaAutosize";
import { prisma } from "../../../../../db/client";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type Inputs = {
  postId: number;
  postContent: string;
};

const schema = z.object({
  postId: z.number(),
  postContent: z
    .string()
    .trim()
    .max(1000, { message: "Post body must be less than 1000 characters" })
    .optional(),
});

const Edit = ({
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
  const editMutation = trpc.useMutation("post.edit", {
    onSuccess(data, variables, context) {
      router.push(`/c/${post.communityName}/${post.id}/${post.slug}`);
    },
  });

  const updatePost: SubmitHandler<Inputs> = (data) => {
    console.log(data.postId);
    editMutation.mutate({ postId: data.postId, postContent: data.postContent });
  };

  return (
    <section className="w-full max-w-xl mx-auto flex flex-col gap-10">
      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold">Edit Post</h1>
        <span></span>
      </div>
      <div className="flex flex-col gap-5 rounded-md">
        {editMutation.error && (
          <div className="bg-alert p-3 rounded-md text-foreground flex items-center gap-2">
            <BiErrorCircle size={22} />
            <span>Something has gone terrible wrong!</span>
          </div>
        )}

        <div className="flex justify-between items-center flex-wrap">
          <p className="mr-5 mb-2">
            Posted to{" "}
            <Link href={`/c/${post.communityName}`}>
              <a
                data-cy="post-community"
                className="text-highlight font-semibold"
              >
                {post.communityName}
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

        <form
          onSubmit={handleSubmit((data) => updatePost(data, post.id))}
          className="flex flex-col gap-5 rounded-md"
        >
          <div>
            <p className="opacity-70 border-2 focus:outline-none focus:border-grayAlt dark:focus:border-grayAlt rounded-md p-4 bg-whiteAlt text-darkTwo dark:border-darkTwo  dark:bg-darkOne dark:text-foreground cursor-not-allowed">
              {post.title}
            </p>
            <span className="text-grayAlt text-sm">
              Changing post title is not supported at the moment
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <MarkdownTipsModal />
            <TextareaAutosize
              data-cy="edit-post-body"
              placeholder={`# Your Post \nLet the world know what you're thinking. Start with a title and then add some content to spice up your post! 😀`}
              register={register("postContent")}
              minHeight={250}
            />
            {errors.postContent?.message && (
              <span className="text-alert">{errors.postContent.message}</span>
            )}
          </div>

          <div className="flex justify-end gap-5">
            <DeletePostModal postId={post.id} />
            <button
              data-cy="submit"
              disabled={watch("postContent") === post.content}
              className="bg-success text-whiteAlt self-end h-12 p-4 rounded-md flex items-center disabled:opacity-50 animate-popIn active:hover:animate-none active:focus:animate-none active:focus:scale-95 active:hover:scale-95 transition-all"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </section>
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
      id: Number(context.params?.postId),
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

  if (post?.author.id !== session.user.id) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      post,
    },
  };
};

export default Edit;
