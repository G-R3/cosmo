import { useState } from "react";
import { useRouter } from "next/router";
import { BiErrorCircle } from "react-icons/bi";
import { useForm, SubmitHandler } from "react-hook-form";
import { trpc } from "../../utils/trpc";
import SearchCommunity from "../../components/SearchCommunity";
import MarkdownTipsModal from "@/components/MarkdownTipsModal";
import TextareaAutosize from "@/components/TextareaAutosize";

type Inputs = {
  community: string;
  postTitle: string;
  postContent?: string;
};

const Submit = () => {
  const router = useRouter();
  const [community, setCommunity] = useState<number>(0);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const createPostMutation = trpc.useMutation("post.create", {
    onSuccess(data) {
      // should redirect to the post page
      router.push(
        `/c/${data.post.community.name}/${data.post.id}/${data.post.slug}`,
      );
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    createPostMutation.mutate({
      title: data.postTitle,
      content: data.postContent,
      communityId: community,
    });
  };

  return (
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
        <SearchCommunity setValue={setCommunity} />
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
            data-cy="post-body"
            placeholder={`# Your Post \nLet the world know what you're thinking. Start with a title and then add some content to spice up your post! 😀`}
            minHeight={250}
          />
        </div>
        <input
          data-cy="submit"
          type="submit"
          value="Post"
          disabled={createPostMutation.isLoading}
          {...register("postContent")}
          className="bg-whiteAlt text-darkOne self-end py-3 px-4 cursor-pointer rounded-md flex items-center disabled:opacity-50 animate-popIn active:hover:animate-none active:focus:animate-none active:focus:scale-95 active:hover:scale-95 transition-all"
        />
      </form>
    </section>
  );
};

Submit.auth = true;

export default Submit;
