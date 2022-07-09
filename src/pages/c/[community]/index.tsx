import { useRouter } from "next/router";
import Link from "next/link";
import { trpc } from "../../../utils/trpc";
import Post from "../../../components/Post";

const Index = () => {
  const query = useRouter().query.community as string;
  const utils = trpc.useContext();
  const communityQuery = trpc.useQuery(["community.get", { query }], {
    refetchOnWindowFocus: false,
  });
  const postQuery = trpc.useQuery(
    ["post.get-by-community", { communityId: communityQuery.data?.id }],
    {
      enabled: !!communityQuery.data?.id,
    },
  );

  const voteMutation = trpc.useMutation("post.vote", {
    onSuccess(data, variables, context) {
      utils.invalidateQueries("community.get");
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

  const handleVote = (vote: number, postId: number) => {
    voteMutation.mutate({ voteType: vote, postId });
  };

  return (
    <div>
      <div className="flex flex-col gap-3">
        <h1 className="text-5xl font-bold">{communityQuery.data?.name}</h1>
        <p>{communityQuery.data?.description}</p>
      </div>

      <div className="flex flex-col gap-10 py-10">
        {postQuery.data ? (
          postQuery.data.map((post) => (
            <Post key={post.id} {...post} onVote={handleVote} />
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
