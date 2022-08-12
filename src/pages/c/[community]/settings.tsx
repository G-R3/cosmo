import { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiX } from "react-icons/fi";
import { useSession } from "next-auth/react";
import { trpc } from "@/utils/trpc";
import { NextPageWithAuth } from "@/components/auth/Auth";
import TextareaAutosize from "@/components/common/TextareaAutosize";
import Tag from "@/components/Communities/Tag";
import SearchUser from "@/components/User/SearchUser";
import RemoveModModal from "@/components/Communities/RemoveModModal";

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
  const { data: session } = useSession();
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

  const isAdmin = session?.user.role === "ADMIN";

  useEffect(() => {
    if (data && !data.isModerator && !isAdmin) {
      router.push(`/c/${data.community.name}`);
    }
  }, [data, router, isAdmin]);

  if (isLoading || (!data?.isModerator && !isAdmin)) {
    return <div>Loading...</div>;
  }

  const editCommunity: SubmitHandler<Inputs> = (data) => {
    editMutation.mutate({
      communityId: data.communityId,
      communityTitle: data.communityTitle,
      communityDescription: data.communityDescription,
    });
  };

  if (error || !data) {
    console.log(error);
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
        <title>{data.community.name} | Settings</title>
        <meta
          name="description"
          content="A place to create communities and discuss"
        />
      </Head>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-bold mb-8">
          Community Settings
        </h1>

        <form
          id="editCommunity"
          onSubmit={handleSubmit(editCommunity)}
          className="flex flex-col gap-8"
        >
          <div className="flex flex-col gap-1">
            <div className="flex flex-col mb-2">
              <label htmlFor="title">
                Display Title <span>(optional)</span>
              </label>
              <span className="text-sm text-grayAlt">
                Set a display title for this community
              </span>
            </div>
            <input
              type="text"
              id="communityTitle"
              autoComplete="false"
              placeholder="Display title (optional)"
              defaultValue={data.community.title ? data.community.title : ""}
              {...register("communityTitle")}
              className="w-full border-2 focus:outline-none focus:border-grayAlt dark:focus:border-grayAlt rounded-md p-4 bg-whiteAlt dark:border-darkTwo text-darkTwo placeholder:text-grayAlt dark:bg-darkOne dark:text-foreground"
            />
            {errors.communityTitle?.message && (
              <span
                data-cy="community-title-error"
                className="text-sm text-alert"
              >
                {errors.communityTitle?.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex flex-col mb-2">
              <label htmlFor="community-description">
                Description <span>(optional)</span>
              </label>
              <span className="text-sm text-grayAlt">
                Set a description for this community
              </span>
            </div>
            <div className="flex flex-col">
              <TextareaAutosize
                placeholder="Description (optional)"
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
              data-cy="confirm-edit"
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

        <div className="mb-8">
          <div className="flex flex-col mb-2">
            <label htmlFor="community-description">
              Tags <span>(optional)</span>
            </label>
            <span className="text-sm text-grayAlt">
              Set up tags that acts as labels for posts made to this community
            </span>
          </div>
          <TagInput
            tags={data.community.tags}
            communityId={data.community.id}
          />
        </div>

        <div className="mb-8">
          <div className="flex flex-col mb-2">
            <label htmlFor="community-description">Moderators</label>
            <span className="text-sm text-grayAlt">
              Add or remove moderators for this community
            </span>
          </div>
          <ModeratorList
            moderators={data.community.moderators}
            creatorId={data.community.creator.id}
            communityId={data.community.id}
          />
        </div>
      </div>
    </>
  );
};

type TagInput = {
  communityId: string;
  tag: string;
};
const tagSchema = z.object({
  communityId: z.string(),
  tag: z
    .string()
    .trim()
    .min(1, { message: "Tag name can't be empty" })
    .max(64, { message: "Tag must be less than 64 characters long" }),
});

const TagInput: FC<{
  tags: {
    id: string;
    name: string;
  }[];
  communityId: string;
}> = ({ tags, communityId }) => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isValid, isDirty },
  } = useForm<TagInput>({
    defaultValues: { communityId },
    resolver: zodResolver(tagSchema),
    mode: "onChange",
  });
  const utils = trpc.useContext();
  const addMutation = trpc.useMutation("community.add-tag", {
    onSuccess: (data) => {
      utils.invalidateQueries(["community.get"]);
      reset({
        communityId: data.tag.communityId,
        tag: "",
      });
    },
  });
  const removeMutation = trpc.useMutation("community.remove-tag", {
    onSuccess: (data) => {
      utils.invalidateQueries(["community.get"]);
      reset({
        communityId: data.tag.communityId,
        tag: "",
      });
    },
  });

  const addTag: SubmitHandler<TagInput> = (data) => {
    const { tag: newTag, communityId } = data;

    const tagExists = tags.some((tag) => tag.name === newTag.trim());

    if (tagExists) {
      setError("tag", {
        type: "custom",
        message: "Tag already exists for this community",
      });
      return;
    }

    addMutation.mutate({ communityId, tag: newTag });
  };

  const removeTag = (tagId: string) => {
    removeMutation.mutate({ tagId });
  };

  return (
    <>
      {tags.length > 0 && (
        <ul className="flex flex-wrap gap-2 my-3">
          {tags.map((tag) => (
            <li key={tag.id}>
              <Tag
                label={tag.name}
                onClick={() => removeTag(tag.id)}
                icon={<FiX size={12} />}
              />
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={handleSubmit(addTag)} className="flex gap-x-6">
        <input
          {...register("tag")}
          autoComplete="false"
          placeholder="Tag (optional)"
          className="w-full border-2 focus:outline-none focus:border-grayAlt dark:focus:border-grayAlt rounded-md p-4 bg-whiteAlt dark:border-darkTwo text-darkTwo placeholder:text-grayAlt dark:bg-darkOne dark:text-foreground"
        />

        <button
          disabled={!isDirty || !isValid}
          className="bg-whiteAlt border-2 text-darkTwo px-4 py-2 rounded-md disabled:opacity-50 disabled:scale-95 animate-popIn active:hover:animate-none active:focus:animate-none active:focus:scale-95 active:hover:scale-95 transition-all focus-visible:focus:outline focus-visible:focus:outline-[3px] focus-visible:focus:outline-highlight"
        >
          Add
        </button>
      </form>
      {errors.tag?.message && (
        <span className="text-alert">{errors.tag?.message}</span>
      )}
    </>
  );
};

type SearchInput = {
  userId: string;
  communityId: string;
};

type Props = {
  communityId: string;
  creatorId: string;
  moderators: {
    user: {
      id: string;
      name: string | null;
      image: string | null;
    };
    createdAt: Date;
  }[];
};

const searchSchema = z.object({
  communityId: z.string().trim(),
  userId: z
    .string({
      required_error: "User is required",
      invalid_type_error: "User is required",
    })
    .trim()
    .min(1, { message: "User is required" }),
});

const ModeratorList: FC<Props> = ({ moderators, creatorId, communityId }) => {
  const {
    handleSubmit,
    setValue,
    reset,
    setError,
    formState: { errors, isDirty },
  } = useForm<SearchInput>({
    defaultValues: { communityId },
    resolver: zodResolver(searchSchema),
  });
  const utils = trpc.useContext();
  const addMutation = trpc.useMutation("community.add-moderator", {
    onSuccess(data, variables, context) {
      utils.invalidateQueries(["community.get"]);
    },
  });

  const addModerator: SubmitHandler<SearchInput> = (data) => {
    const { userId, communityId } = data;
    const isExistingMod = moderators.some((mod) => mod.user.id === userId);
    if (isExistingMod) {
      setError("userId", {
        type: "custom",
        message: "User is already a moderator for this community.",
      });

      return;
    }
    addMutation.mutate({ communityId, userId });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(addModerator)}
        className="flex flex-col gap-4"
      >
        <SearchUser
          reset={() => reset({ userId: "", communityId })}
          setValue={setValue}
        />
        {errors.userId?.message && (
          <span className="text-alert">{errors.userId.message}</span>
        )}
        <button
          disabled={addMutation.isLoading}
          className="self-end bg-whiteAlt border-2 text-darkTwo px-4 py-2 rounded-md disabled:opacity-50 disabled:scale-95 animate-popIn active:hover:animate-none active:focus:animate-none active:focus:scale-95 active:hover:scale-95 transition-all focus-visible:focus:outline focus-visible:focus:outline-[3px] focus-visible:focus:outline-highlight"
        >
          Add
        </button>
      </form>
      <ul className="mt-5 flex flex-col border border-grayAlt rounded-md overflow-hidden">
        {moderators.map((mod, idx) => (
          <li
            key={mod.user.id}
            className={`grid grid-cols-3 p-4 ${
              idx % 2 ? "bg-whiteAlt dark:bg-darkOne" : ""
            }`}
          >
            <Link href={`/user/${mod.user.id}`} key={mod.user.id}>
              <a className="flex items-center gap-x-2 w-fit hover:underline hover:underline-offset-1">
                <div className="w-fit flex rounded-full outline outline-offset-2 outline-1 outline-highlight">
                  <span
                    style={{
                      backgroundImage: `url(${mod.user.image})`,
                    }}
                    className="w-6 h-6 bg-cover bg-no-repeat bg-center rounded-full outline-none"
                  ></span>
                </div>
                {mod.user.name}
              </a>
            </Link>
            <span className="text-center">
              {mod.createdAt.toLocaleDateString()}
            </span>

            {creatorId === mod.user.id ? (
              <span className="justify-self-end text-grayAlt">Creator</span>
            ) : (
              <div className="justify-self-end">
                <RemoveModModal
                  userId={mod.user.id}
                  userName={mod.user.name!}
                  communityId={communityId}
                />
              </div>
            )}
          </li>
        ))}
      </ul>
    </>
  );
};

EditCommunity.auth = true;

export default EditCommunity;
