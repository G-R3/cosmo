import { useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";

// this is a cursed hook O.o

type Paths =
  | "post.feed"
  | "post.get-by-community"
  | "user.get-posts"
  | "user.get-liked-posts"
  | "user.get-saved-posts";

const useSavePost = (path: Paths, query?: any) => {
  const { data: session } = useSession();
  const utils = trpc.useContext();

  const queryArg: [Paths, any] | [Paths] = query ? [path, query] : [path];

  const saveMutation = trpc.useMutation(["post.save"], {
    // optimistic update
    // I still don't quite get this but it sounded like what i needed.
    // https://tanstack.com/query/v4/docs/guides/optimistic-updates
    onMutate: async (savedPost) => {
      await utils.cancelQuery(queryArg);
      const previousData = utils.getQueryData(queryArg);

      if (previousData) {
        utils.setQueryData(queryArg, {
          ...previousData,
          posts: previousData.posts.map((post) =>
            post.id === savedPost.postId
              ? {
                  ...post,
                  savedBy: [
                    ...post.savedBy,
                    {
                      userId: session?.user.id!,
                      postId: savedPost.postId,
                    },
                  ],
                }
              : post,
          ),
        });
      }

      return { previousData };
    },
    onError: (err, data, context) => {
      if (context?.previousData) {
        utils.setQueryData(queryArg, context?.previousData);
      }
    },
    onSettled(data, error, variables, context) {
      utils.invalidateQueries(["post.feed"]);
      utils.invalidateQueries(["post.get-by-community"]);
      utils.invalidateQueries(["user.get-posts"]);
      utils.invalidateQueries(["user.get-liked-posts"]);
    },
  });

  const unSaveMutation = trpc.useMutation(["post.unsave"], {
    onMutate: async (unSavedPost) => {
      await utils.cancelQuery(queryArg);
      const previousData = utils.getQueryData(queryArg);

      if (previousData) {
        utils.setQueryData(queryArg, {
          ...previousData,
          posts: previousData.posts.map((post) =>
            post.id === unSavedPost.postId
              ? {
                  ...post,
                  savedBy: post.savedBy.filter(
                    (save) => save.userId !== session?.user.id!,
                  ),
                }
              : post,
          ),
        });
      }

      return { previousData };
    },
    onError: (err, data, context) => {
      if (context?.previousData) {
        utils.setQueryData(queryArg, context?.previousData);
      }
    },
    onSettled(data, error, variables, context) {
      utils.invalidateQueries(["post.feed"]);
      utils.invalidateQueries(["post.get-by-community"]);
      utils.invalidateQueries(["user.get-posts"]);
    },
  });

  const onSave = (postId: number) => {
    saveMutation.mutate({ postId });
  };
  const onUnsave = (postId: number) => {
    unSaveMutation.mutate({ postId });
  };

  return { onSave, onUnsave };
};

export default useSavePost;
