import { useRouter } from "next/router";
import Link from "next/link";
import { trpc } from "@/utils/trpc";
import Post from "@/components/Post";
import PostSkeleton from "@/components/PostSkeleton";
import useLike from "@/hooks/useLike";

const Index = () => {
  const query = useRouter().query.community as string;
  const communityQuery = trpc.useQuery(["community.get", { query }], {
    refetchOnWindowFocus: false,
  });
  const postQuery = trpc.useQuery(["post.get-by-community", { query }]);
  const { onLike, onUnlike } = useLike("post.get-by-community", { query });

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
            <Post key={post.id} {...post} onLike={onLike} onUnlike={onUnlike} />
          ))}
        {postQuery.data?.posts.length === 0 && (
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
