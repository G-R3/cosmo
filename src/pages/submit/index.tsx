import { useRouter } from "next/router";
import { BiErrorCircle } from "react-icons/bi";
import Head from "next/head";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@/utils/trpc";
import SearchCommunity from "@/components/SearchCommunity";
import MarkdownTipsModal from "@/components/MarkdownTipsModal";
import TextareaAutosize from "@/components/TextareaAutosize";
import { NextPageWithAuth } from "@/components/Auth";

type Inputs = {
  postCommunityId: string;
  postTitle: string;
  postContent?: string;
};

const schema = z.object({
  postCommunityId: z.string({
    required_error: "Community is required",
    invalid_type_error: "Community is required",
  }),
  postTitle: z.string().trim().min(1, { message: "Post title is required" }),
  postContent: z
    .string()
    .trim()
    .max(1000, { message: "Post body must be less than 1000 characters" })
    .optional(),
});

const Submit: NextPageWithAuth = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const createPostMutation = trpc.useMutation("post.create", {
    onSuccess(data) {
      router.push(
        `/c/${data.post.community.name}/${data.post.id}/${data.post.slug}`,
      );
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    createPostMutation.mutate({
      title: data.postTitle,
      content: data.postContent,
      communityId: data.postCommunityId,
    });
  };

  return (
    <>
      <Head>
        <title>Create Post | Cosmo</title>
        <meta
          name="description"
          content="A place to create communities and discuss"
        />
      </Head>
      <section className="w-full max-w-xl mx-auto flex flex-col gap-10">
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold">Create Post</h1>
          <span className="mt-2 text-grayAlt">
            Join the fun and share something exiting
          </span>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 rounded-md"
        >
          {createPostMutation.error && (
            <div className="bg-alert p-3 rounded-md text-foreground flex items-center gap-2">
              <BiErrorCircle size={22} />
              <span>Something has gone terrible wrong!</span>
            </div>
          )}
          <div className="flex flex-col gap-2">
            <SearchCommunity setValue={setValue} reset={reset} />
            {errors.postCommunityId?.message && (
              <span className="text-alert">
                {errors.postCommunityId.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <input
              id="postTitle"
              data-cy="post-title"
              type="text"
              placeholder="Post"
              {...register("postTitle", { required: true, min: 1 })}
              className="border-2 focus:outline-none focus:border-grayAlt dark:focus:border-grayAlt rounded-md p-4 bg-whiteAlt dark:border-darkTwo text-darkTwo placeholder:text-grayAlt dark:bg-darkOne dark:text-foreground"
            />
            {errors.postTitle && (
              <span className="text-alert">This field is required!</span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <MarkdownTipsModal />
            <TextareaAutosize
              id="post-content"
              data-cy="post-body"
              placeholder={`# Your Post \nLet the world know what you're thinking. Start with a title and then add some content to spice up your post! 😀`}
              register={register("postContent")}
            />
            {errors.postContent?.message && (
              <span className="text-alert">{errors.postContent.message}</span>
            )}
          </div>
          <input
            data-cy="submit"
            type="submit"
            value="Post"
            disabled={createPostMutation.isLoading}
            className="bg-whiteAlt text-darkOne self-end py-3 px-4 cursor-pointer rounded-md flex items-center disabled:opacity-50 animate-popIn active:hover:animate-none active:focus:animate-none active:focus:scale-95 active:hover:scale-95 transition-all"
          />
        </form>
      </section>
    </>
  );
};

Submit.auth = true;

export default Submit;
