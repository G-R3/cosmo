import { useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";

type Paths =
  | "post.feed"
  | "post.get-by-community"
  | "user.get-posts"
  | "user.get-liked-posts"
  | "user.get-saved-posts";

const useLikePost = (path: Paths, query?: any) => {
  const { data: session } = useSession();
  const utils = trpc.useContext();

  const queryArg: [Paths, any] | [Paths] = query ? [path, query] : [path];

  const likeMutation = trpc.useMutation(["post.like"], {
    // optimistic update
    // I still don't quite get this but it sounded like what i needed.
    // https://tanstack.com/query/v4/docs/guides/optimistic-updates
    onMutate: async (likedPost) => {
      await utils.cancelQuery(queryArg);
      const previousData = utils.getQueryData(queryArg);

      if (previousData) {
        utils.setQueryData(queryArg, {
          ...previousData,
          posts: previousData.posts.map((post) =>
            post.id === likedPost.postId
              ? {
                  ...post,
                  likes: [
                    ...post.likes,
                    {
                      userId: session?.user.id!,
                      postId: likedPost.postId,
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
  });

  const unlikeMutation = trpc.useMutation(["post.unlike"], {
    onMutate: async (unLikedPost) => {
      await utils.cancelQuery(queryArg);
      const previousData = utils.getQueryData(queryArg);

      if (previousData) {
        utils.setQueryData(queryArg, {
          ...previousData,
          posts: previousData.posts.map((post) =>
            post.id === unLikedPost.postId
              ? {
                  ...post,
                  likes: post.likes.filter(
                    (like) => like.userId !== session?.user.id!,
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
  });

  const onLike = (postId: string) => {
    likeMutation.mutate({ postId });
  };
  const onUnlike = (postId: string) => {
    unlikeMutation.mutate({ postId });
  };

  return { onLike, onUnlike };
};

export default useLikePost;
