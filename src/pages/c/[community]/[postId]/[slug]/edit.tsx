import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { useRouter } from "next/router";
import Link from "next/link";
import { BiErrorCircle } from "react-icons/bi";
import useTextarea from "@/hooks/useTextarea";
import MarkdownTipsModal from "@/components/MarkdownTipsModal";
import { trpc } from "@/utils/trpc";
import { prisma } from "../../../../../db/client";
import { authOptions } from "src/pages/api/auth/[...nextauth]";
import { AiFillHeart } from "react-icons/ai";

const Edit = ({
  post,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { content, setContent, textareaRef } = useTextarea(post.content);
  const editMutation = trpc.useMutation("post.edit", {
    onSuccess(data, variables, context) {
      router.push(`/c/${post.communityName}/${post.id}/${post.slug}`);
    },
  });

  const handleSubmit = (postId: number, content: string) => {
    editMutation.mutate({ postId, content });
  };

  console.log(post);

  return (
    <section className="w-full max-w-xl mx-auto flex flex-col gap-10">
      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold">Edit Post</h1>
        <span></span>
      </div>
      <div className="flex flex-col gap-5 rounded-md">
        {editMutation.error && (
          <div className="bg-error p-3 rounded-md text-foreground flex items-center gap-2">
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

        <div>
          <p className="opacity-70 border-2 focus:outline-none focus:border-grayAlt dark:focus:border-grayAlt rounded-md p-4 bg-whiteAlt text-darkTwo dark:border-darkTwo  dark:bg-darkOne dark:text-foreground cursor-not-allowed">
            {post.title}
          </p>
          <span className="text-grayAlt text-sm">
            Changing post title is not supported at the momemnt
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <MarkdownTipsModal />
          <textarea
            data-cy="edit-post-body"
            ref={textareaRef}
            placeholder={`# Your Post \nLet the world know what you're thinking. Start with a title and then add some content to spice up your post! 😀`}
            onChange={(e) => {
              setContent(e.target.value);
            }}
            value={content}
            className="border-2 focus:outline-none focus:border-grayAlt dark:focus:border-grayAlt rounded-md py-3 px-4 bg-whiteAlt dark:border-darkTwo text-darkTwo placeholder:text-grayAlt dark:bg-darkOne dark:text-foreground overflow-hidden resize-none"
          ></textarea>
        </div>

        <button
          data-cy="submit"
          onClick={() => handleSubmit(post.id, content)}
          disabled={editMutation.isLoading}
          className="bg-success text-whiteAlt self-end h-12 p-4 rounded-md flex items-center disabled:opacity-50 animate-popIn active:hover:animate-none active:focus:animate-none active:focus:scale-95 active:hover:scale-95 transition-all"
        >
          Save
        </button>
      </div>
    </section>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context, authOptions);

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
      communityName: true,
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
