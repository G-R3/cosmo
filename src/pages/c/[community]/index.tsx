import { useRouter } from "next/router";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { trpc } from "../../../utils/trpc";
import Post from "../../../components/Post";
import PostSkeleton from "../../../components/PostSkeleton";

const Index = () => {
  const { data: session } = useSession();
  const query = useRouter().query.community as string;
  const utils = trpc.useContext();
  const communityQuery = trpc.useQuery(["community.get", { query }], {
    refetchOnWindowFocus: false,
  });
  const postQuery = trpc.useQuery(["post.get-by-community", { query }]);

  const likeMutation = trpc.useMutation(["post.like"], {
    onMutate: async (likedPost) => {
      await utils.cancelQuery(["post.get-by-community", { query }]);
      const previousData = utils.getQueryData([
        "post.get-by-community",
        { query },
      ]);

      if (previousData) {
        utils.setQueryData(["post.get-by-community", { query }], {
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
        utils.setQueryData(["post.get-by-community"], context?.previousData);
      }
    },
  });

  const unlikeMutation = trpc.useMutation(["post.unlike"], {
    onMutate: async (unLikedPost) => {
      await utils.cancelQuery(["post.get-by-community", { query }]);
      const previousData = utils.getQueryData([
        "post.get-by-community",
        { query },
      ]);

      if (previousData) {
        utils.setQueryData(["post.get-by-community", { query }], {
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
        utils.setQueryData(["post.get-by-community"], context?.previousData);
      }
    },
  });

  if (communityQuery.error) {
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

  if (communityQuery.isLoading) {
    return <div>Loading...</div>;
  }

  const onLike = (postId: number) => {
    likeMutation.mutate({ postId });
  };
  const onUnlike = (postId: number) => {
    unlikeMutation.mutate({ postId });
  };

  return (
    <div>
      <div className="flex flex-col gap-3">
        <h1 className="text-5xl font-bold">{communityQuery.data?.name}</h1>
        <p>{communityQuery.data?.description}</p>
      </div>

      <div className="flex flex-col gap-10 py-10">
        {postQuery.isLoading &&
          Array(13)
            .fill(0)
            .map((skeleton, idx) => <PostSkeleton key={idx} />)}
        {postQuery?.data?.posts ? (
          postQuery?.data?.posts.map((post) => (
            <Post key={post.id} {...post} onLike={onLike} onUnlike={onUnlike} />
          ))
        ) : (
          <div className="flex items-center flex-col gap-5 mt-10">
            <h1 className="text-grayAlt text-2xl font-bold">
              Looks like nothing has been posted to {communityQuery.data?.name}{" "}
              community yet.
            </h1>
            <Link href="/submit">
              <a className="text-foreground">Create a post</a>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
