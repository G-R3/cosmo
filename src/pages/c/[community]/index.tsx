import { useRouter } from "next/router";
import Link from "next/link";
import { NextPage } from "next";
import Head from "next/head";
import { trpc } from "@/utils/trpc";
import Post from "@/components/Post";
import PostSkeleton from "@/components/PostSkeleton";
import useLikePost from "@/hooks/useLikePost";
import useSavePost from "@/hooks/useSavePost";

const Index: NextPage = () => {
  const query = useRouter().query.community as string;
  const communityQuery = trpc.useQuery(["community.get", { query }], {
    refetchOnWindowFocus: false,
  });
  const postQuery = trpc.useQuery(["post.get-by-community", { query }]);
  const { onLike, onUnlike } = useLikePost("post.get-by-community", { query });
  const { onSave, onUnsave } = useSavePost("post.get-by-community", { query });

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

  return (
    <>
      <Head>
        <title>{communityQuery.data?.name} Cosmo</title>
        <meta
          name="description"
          content="A place to create communities and discuss"
        />
      </Head>
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
          {postQuery?.data?.posts &&
            postQuery?.data?.posts.map((post) => (
              <Post
                key={post.id}
                {...post}
                onLike={onLike}
                onUnlike={onUnlike}
                onSave={onSave}
                onUnsave={onUnsave}
              />
            ))}
          {postQuery.data?.posts.length === 0 && (
            <div className="flex items-center flex-col gap-5 mt-10">
              <h1 className="text-grayAlt text-2xl font-bold">
                Looks like nothing has been posted to{" "}
                {communityQuery.data?.name} community yet.
              </h1>
              <Link href="/submit">
                <a className="text-foreground">Create a post</a>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Index;
