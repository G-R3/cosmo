import { NextPageWithAuth } from "@/components/auth/Auth";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@/utils/trpc";
import { BiErrorCircle } from "react-icons/bi";
import SearchCommunity from "@/components/submit/SearchCommunity";
import MarkdownTipsModal from "@/components/common/MarkdownTipsModal";
import TextareaAutosize from "@/components/common/TextareaAutosize";
import CustomHead from "@/components/common/CustomHead";
import Button from "@/components/common/Button";
import Alert from "@/components/common/Alert";

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
  postTitle: z.string().trim().min(1, { message: "Title is required" }),
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
    watch,
    formState: { errors, isDirty, isValid },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const createPostMutation = trpc.useMutation("post.create", {
    onSuccess(data) {
      reset();
      router.push(`/post/${data.post.id}`);
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
      <CustomHead title="Create Post | Cosmo" />
      <section className="w-full max-w-xl mx-auto flex flex-col gap-6">
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
            <Alert type="error">
              <BiErrorCircle size={22} />
              <span>
                Oh oh! Something went wrong while trying to create post. Try
                again later.
              </span>
            </Alert>
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
            {errors.postTitle?.message && (
              <span className="text-alert">{errors.postTitle.message}</span>
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
          <Button
            variant="primary"
            size="lg"
            data-cy="submit"
            loading={createPostMutation.isLoading}
            disabled={!isValid || !isDirty || !watch("postTitle")}
          >
            Create Post
          </Button>
        </form>
      </section>
    </>
  );
};

Submit.auth = true;

export default Submit;
