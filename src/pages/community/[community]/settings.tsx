import { FC, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiX } from "react-icons/fi";
import { useSession } from "next-auth/react";
import { trpc } from "@/utils/trpc";
import { NextPageWithAuth } from "@/components/auth/Auth";
import TextareaAutosize from "@/components/common/TextareaAutosize";
import Tag from "@/components/communities/settings/Tag";
import SearchUser from "@/components/communities/settings/SearchUser";
import RemoveModModal from "@/components/communities/settings/RemoveModModal";
import CustomHead from "@/components/common/CustomHead";
import Button from "@/components/common/Button";
import Preloader from "@/components/common/Preloader";
import NotFound from "@/components/common/NotFound";
import ButtonLink from "@/components/common/ButtonLink";

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
  const utils = trpc.useContext();
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
  const { data, isLoading, error, isError } = trpc.useQuery(
    ["community.get", { query }],
    {
      refetchOnWindowFocus: false,
      onSuccess(data) {
        setValue("communityId", data.community.id);
      },
    },
  );
  const editMutation = trpc.useMutation("community.edit", {
    onSuccess(data, variables, context) {
      utils.invalidateQueries(["community.get", { query }]);
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
      router.push(`/community/${data.community.name}`);
    }
  }, [data, router, isAdmin]);

  if (isLoading || (!data?.isModerator && !isAdmin)) {
    return <Preloader />;
  }

  const editCommunity: SubmitHandler<Inputs> = (data) => {
    editMutation.mutate({
      communityId: data.communityId,
      communityTitle: data.communityTitle,
      communityDescription: data.communityDescription,
    });
  };

  // TODO: do I need this??? (im so bad at this man....)
  if (error || !data) {
    return (
      <div className="flex justify-center">
        <div className="flex flex-col gap-5 justify-center items-center">
          <NotFound
            heading="Woah there!"
            text="Nothing seems to exists on this side of the universe"
          />

          <ButtonLink href="/" variant="primary">
            Return home
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <>
      <CustomHead title={`${data.community.name} | Settings`} />
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

          <div className="flex self-end">
            <Button
              form="editCommunity"
              data-cy="confirm-edit"
              variant="primary"
              size="md"
              disabled={
                (watch("communityDescription") === data.community.description &&
                  watch("communityTitle") === data.community.title) ||
                Object.keys(errors).length > 0 ||
                !isDirty
              }
              loading={editMutation.isLoading}
            >
              Save
            </Button>
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
      <form onSubmit={handleSubmit(addTag)} className="flex flex-col gap-y-3">
        {errors.tag?.message && (
          <span className="text-alert">{errors.tag?.message}</span>
        )}
        <input
          {...register("tag")}
          autoComplete="false"
          placeholder="Tag (optional)"
          className="w-full border-2 focus:outline-none focus:border-grayAlt dark:focus:border-grayAlt rounded-md p-4 bg-whiteAlt dark:border-darkTwo text-darkTwo placeholder:text-grayAlt dark:bg-darkOne dark:text-foreground"
        />

        <div className="flex justify-end">
          <Button
            disabled={!isDirty || !isValid}
            loading={addMutation.isLoading}
            variant="primary"
            size="md"
          >
            Add community tag
          </Button>
        </div>
      </form>
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
        className="flex flex-col gap-2"
      >
        {errors.userId?.message && (
          <span className="text-alert">{errors.userId.message}</span>
        )}
        <SearchUser
          reset={() => reset({ userId: "", communityId })}
          setValue={setValue}
        />

        <div className="flex justify-end">
          <Button loading={addMutation.isLoading} variant="primary" size="md">
            Add moderator
          </Button>
        </div>
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
