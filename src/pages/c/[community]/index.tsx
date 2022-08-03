import { useRouter } from "next/router";
import Link from "next/link";
import { NextPage } from "next";
import Head from "next/head";
import { MdOutlineAddModerator } from "react-icons/md";
import { trpc } from "@/utils/trpc";
import Post from "@/components/Post";
import PostSkeleton from "@/components/PostSkeleton";
import useLikePost from "@/hooks/useLikePost";
import useSavePost from "@/hooks/useSavePost";
import Tag from "@/components/Tag";

const Index: NextPage = () => {
  const query = useRouter().query.community as string;
  const communityQuery = trpc.useQuery(["community.get", { query }], {
    refetchOnWindowFocus: false,
  });
  const postQuery = trpc.useQuery(["post.get-by-community", { query }]);
  const { onLike, onUnlike } = useLikePost("post.get-by-community", { query });
  const { onSave, onUnsave } = useSavePost("post.get-by-community", { query });

  if (communityQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (communityQuery.error || !communityQuery.data) {
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
        <title>
          {!!communityQuery.data?.community.title
            ? communityQuery.data?.community.title
            : communityQuery.data?.community.name}
        </title>
        <meta
          name="description"
          content="A place to create communities and discuss"
        />
      </Head>
      <div>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between">
            <h1 className="text-3xl sm:text-5xl font-bold">
              {!!communityQuery.data?.community.title
                ? communityQuery.data?.community.title
                : communityQuery.data?.community.name}
            </h1>
            {communityQuery.data?.isModerator && (
              <Link href={`/c/${communityQuery.data?.community.name}/edit`}>
                <a className="self-start px-3 py-[6px] border rounded-md border-grayAlt">
                  Community settings
                </a>
              </Link>
            )}
          </div>
          <p className="text-grayAlt font-semibold ">
            {communityQuery.data.community.name}
          </p>
        </div>

        <div className="flex flex-col gap-10 py-10">
          {postQuery.isLoading &&
            Array(13)
              .fill(0)
              .map((skeleton, idx) => <PostSkeleton key={idx} />)}
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-9 flex flex-col gap-3">
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
            </div>
            <div className="col-span-3 flex flex-col gap-y-3">
              <div className="bg-whiteAlt dark:bg-darkOne p-4 rounded-md flex flex-col gap-2">
                <h2 className="text-grayAlt font-semibold mb-3">
                  About Community
                </h2>
                <p>
                  {communityQuery.data?.community.description
                    ? communityQuery.data?.community.description
                    : `The ${communityQuery.data?.community.name} community`}
                </p>
                <p>
                  <span>Created on </span>
                  {communityQuery.data?.community.createdAt.toLocaleString()}
                </p>
                {/* TODO: stats */}
                <Link href="/submit">
                  <a className="border border-grayAlt px-4 py-2 text-center rounded-md">
                    Create Post
                  </a>
                </Link>
              </div>
              <div className="bg-whiteAlt dark:bg-darkOne p-4 rounded-md flex flex-col gap-2">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-grayAlt font-semibold">
                    Community Moderators
                  </h2>
                  <button title="Add Moderator">
                    <MdOutlineAddModerator size={20} />
                  </button>
                </div>

                <div className="flex flex-col gap-4">
                  {communityQuery.data?.community.moderators.map(
                    (moderator) => (
                      <Link
                        href={`/user/${moderator.user.id}`}
                        key={moderator.user.id}
                      >
                        <a className="flex items-center gap-x-2 w-fit hover:underline hover:underline-offset-1">
                          <div className="w-fit flex rounded-full outline outline-offset-2 outline-1 outline-highlight">
                            <span
                              style={{
                                backgroundImage: `url(${moderator.user.image})`,
                              }}
                              className="w-6 h-6 bg-cover bg-no-repeat bg-center rounded-full outline-none"
                            ></span>
                          </div>
                          {moderator.user.name}
                        </a>
                      </Link>
                    ),
                  )}
                </div>
              </div>
              {communityQuery.data.community.tags.length > 0 && (
                <div className="bg-whiteAlt dark:bg-darkOne p-4 rounded-md flex flex-col gap-2">
                  <h2 className="text-grayAlt font-semibold mb-3">
                    Community Tags
                  </h2>
                  <ul className="flex flex-wrap items-center gap-2 max-w-full">
                    {communityQuery.data.community.tags.map((tag) => (
                      <li
                        key={tag.id}
                        className="max-w-[97%] overflow-hidden text-ellipsis"
                      >
                        <Tag label={tag.name} />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          {postQuery.data?.posts.length === 0 && (
            <div className="flex text-center flex-col gap-5 mt-10">
              <h1 className="text-grayAlt text-xl font-bold">
                Looks like nothing has been posted to{" "}
                {communityQuery.data?.community.name} community yet.
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
