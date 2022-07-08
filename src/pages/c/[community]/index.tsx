import { useRouter } from "next/router";
import Link from "next/link";
import { trpc } from "../../../utils/trpc";
import Post from "../../../components/Post";

const Index = () => {
  const query = useRouter().query.community as string;

  const communityQuery = trpc.useQuery(["community.get", { query }], {
    refetchOnWindowFocus: false,
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

  return (
    <div>
      <div className="flex flex-col gap-3">
        <h1 className="text-5xl font-bold">{communityQuery.data?.name}</h1>
        <p>{communityQuery.data?.description}</p>
      </div>

      <div className="flex flex-col gap-10 py-10">
        {communityQuery.data?.posts && communityQuery.data.posts.length > 0 ? (
          communityQuery.data.posts.map((post) => (
            <Post
              key={post.id}
              {...post}
              id={post.id}
              title={post.title}
              content={post.content}
              slug={post.slug}
              username={post.user.name}
              commentCount={post.commentCount}
              totalVotes={post.totalVotes}
              hasVoted={post.hasVoted ? post.hasVoted : null}
              community={post.community}
            />
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
