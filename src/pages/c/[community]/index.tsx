import { NextPage } from "next";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { trpc } from "@/utils/trpc";
import useLikePost from "@/hooks/useLikePost";
import useSavePost from "@/hooks/useSavePost";
import Post from "@/components/common/Post";
import PostSkeleton from "@/components/common/PostSkeleton";
import Tag from "@/components/communities/settings/Tag";
import CustomHead from "@/components/common/CustomHead";
import Preloader from "@/components/common/Preloader";
import spaceOne from "../../../assets/space-1.svg";
import NotFound from "@/components/common/NotFound";

const Community: NextPage = () => {
  const { data: session } = useSession();
  const query = useRouter().query.community as string;
  const communityQuery = trpc.useQuery(["community.get", { query }], {
    refetchOnWindowFocus: false,
  });
  const postQuery = trpc.useQuery(["post.get-by-community", { query }]);
  const { onLike, onUnlike } = useLikePost("post.get-by-community", { query });
  const { onSave, onUnsave } = useSavePost("post.get-by-community", { query });

  if (communityQuery.isLoading) {
    return <Preloader />;
  }

  if (communityQuery.error || !communityQuery.data) {
    return (
      <div className="flex justify-center">
        <div className="flex flex-col gap-8 justify-center items-center">
          <NotFound
            heading="Woah there!"
            text="Nothing seems to exists on this side of the universe"
          />
          <Link href={"/submit"}>
            <a className="bg-highlight text-whiteAlt h-10 p-4 w-full rounded-md flex items-center justify-center disabled:opacity-50 animate-popIn active:hover:animate-none active:focus:animate-none active:focus:scale-95 active:hover:scale-95 transition-all">
              Return Home
            </a>
          </Link>
        </div>
      </div>
    );
  }

  const { isModerator } = communityQuery.data;
  const isAdmin = session?.user.role === "ADMIN";

  return (
    <>
      <CustomHead
        title={
          !!communityQuery.data?.community.title
            ? communityQuery.data?.community.title
            : communityQuery.data?.community.name
        }
      />
      <div className="flex flex-col gap-3 mb-10">
        <div className="flex justify-between">
          <h1 className="text-3xl sm:text-5xl font-bold">
            {!!communityQuery.data?.community.title
              ? communityQuery.data?.community.title
              : communityQuery.data?.community.name}
          </h1>
          {(isModerator || isAdmin) && (
            <Link href={`/c/${communityQuery.data?.community.name}/settings`}>
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

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-9 flex flex-col gap-3">
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
            <div className="flex flex-col gap-5 justify-center items-center h-full">
              <div className="flex flex-col justify-center gap-10">
                <Image src={spaceOne} alt="Space Illustration" />
                <div className="flex flex-col justify-center items-center max-w-lg mx-auto">
                  <h1 className="text-highlight font-bold text-3xl text-center">
                    Hang on
                  </h1>
                  <p className="text-grayAlt">
                    There doesn&apos;t seem to be anything on this side of the
                    universe
                  </p>
                  <Link href={"/submit"}>
                    <a className="mt-5 bg-highlight text-whiteAlt self-end h-10 p-4 w-full rounded-md flex items-center justify-center disabled:opacity-50 animate-popIn active:hover:animate-none active:focus:animate-none active:focus:scale-95 active:hover:scale-95 transition-all">
                      Create Post
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="col-span-3 flex flex-col gap-y-3">
          <div className="bg-whiteAlt dark:bg-darkOne p-4 rounded-md flex flex-col gap-2">
            <h2 className="text-grayAlt font-semibold mb-3">About Community</h2>
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
            </div>

            <div className="flex flex-col gap-4">
              {communityQuery.data?.community.moderators.map((moderator) => (
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
              ))}
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
    </>
  );
};

export default Community;
