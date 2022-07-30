import { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { trpc } from "@/utils/trpc";
import { NextPageWithAuth } from "@/components/Auth";
import TextareaAutosize from "@/components/TextareaAutosize";

type Inputs = {
  communityId: string;
  communityTitle: string;
  communityDescription: string;
};

const schema = z.object({
  communityId: z.string(),
  communityTitle: z
    .string()
    .trim()
    .max(50, { message: "Title must be less than 50 characters" })
    .optional(),
  communityDescription: z
    .string()
    .trim()
    .max(200, { message: "Description must be less than 200 characters" })
    .optional(),
});

const EditCommunity: NextPageWithAuth = () => {
  const router = useRouter();
  const query = router.query.community as string;
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });
  const { data, isLoading, error } = trpc.useQuery(
    ["community.get", { query }],
    {
      onSuccess(data) {
        setValue("communityId", data.community.id);
      },
    },
  );
  const editMutation = trpc.useMutation("community.edit", {
    onSuccess(data, variables, context) {
      reset({
        communityId: data.community.id,
        communityTitle: data.community.title,
        communityDescription: data.community.description
          ? data.community.description
          : "",
      });
    },
  });

  useEffect(() => {
    if (data && !data?.isModerator) {
      router.push(`/c/${data.community.name}`);
    }
  }, [data, router]);

  if (isLoading || !data?.isModerator) {
    return <div>Loading...</div>;
  }

  const editCommunity: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    editMutation.mutate({
      communityId: data.communityId,
      communityTitle: data.communityTitle,
      communityDescription: data.communityDescription,
    });
  };

  if (error || !data.community) {
    return (
      <div className="flex items-center flex-col gap-5">
        <h1 className="text-2xl font-bold">
          No community exists with that name
        </h1>
        <Link href="/">
          <a>Return Home</a>
        </Link>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{data.community.name} | Edit</title>
        <meta
          name="description"
          content="A place to create communities and discuss"
        />
      </Head>
      <div>
        <h1 className="text-3xl sm:text-5xl font-bold">
          Editing {data.community.name}
        </h1>

        <form
          id="editCommunity"
          onSubmit={handleSubmit(editCommunity)}
          className="mt-4 flex flex-col gap-6"
        >
          <div className="flex flex-col gap-1">
            <label htmlFor="title">Display Title</label>
            <input
              type="text"
              id="communityTitle"
              defaultValue={data.community.title ? data.community.title : ""}
              {...register("communityTitle")}
              className="w-full border-2 focus:outline-none focus:border-grayAlt dark:focus:border-grayAlt rounded-md p-4 bg-whiteAlt dark:border-darkTwo text-darkTwo placeholder:text-slate-400 dark:bg-darkOne dark:text-foreground"
            />
            {errors.communityTitle?.message && (
              <span
                data-cy="community-description-error"
                className="text-sm text-alert"
              >
                {errors.communityTitle?.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="community-description">Description</label>
            <div className="flex flex-col">
              <TextareaAutosize
                defaultValue={
                  data.community.description ? data.community.description : ""
                }
                data-cy="community-description"
                id="community-description"
                register={register("communityDescription")}
                minHeight={100}
              />
              {errors.communityDescription?.message && (
                <span
                  data-cy="community-description-error"
                  className="text-sm text-alert"
                >
                  {errors.communityDescription.message}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-2 self-end">
            <button
              form="editCommunity"
              data-cy="confirm-create"
              disabled={
                (watch("communityDescription") === data.community.description &&
                  watch("communityTitle") === data.community.title) ||
                Object.keys(errors).length > 0 ||
                !isDirty
              }
              className="bg-whiteAlt border-2 text-darkTwo px-4 py-2 rounded-md disabled:opacity-50 disabled:scale-95 animate-popIn active:hover:animate-none active:focus:animate-none active:focus:scale-95 active:hover:scale-95 transition-all focus-visible:focus:outline focus-visible:focus:outline-[3px] focus-visible:focus:outline-highlight"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

EditCommunity.auth = true;

export default EditCommunity;
