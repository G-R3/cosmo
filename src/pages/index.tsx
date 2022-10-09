import { NextPage } from "next";
import Image from "next/image";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { trpc } from "@/utils/trpc";
import Post from "@/components/common/Post";
import PostSkeleton from "@/components/common/PostSkeleton";
import CustomHead from "@/components/common/CustomHead";
import useLikePost from "@/hooks/useLikePost";
import useSavePost from "@/hooks/useSavePost";
import spaceOne from "../assets/space-1.svg";
import NotFound from "@/components/common/NotFound";
import ButtonLink from "@/components/common/ButtonLink";
import CommunitiesPanel from "@/components/user/CommunitiesPanel";
import clx from "@/lib/classnames";

const Home: NextPage = () => {
  const { data: session } = useSession();
  const postQuery = trpc.useQuery(["post.feed"]);
  const followingCommunitiesQuery = trpc.useQuery(
    ["user.get-communities", { userId: session?.user.id!, isMember: true }],
    {
      enabled: !!session?.user.id,
    },
  );
  const { onLike, onUnlike } = useLikePost("post.feed");
  const { onSave, onUnsave } = useSavePost("post.feed");

  if (postQuery.error) {
    return (
      <div className="flex flex-col justify-center gap-10">
        <Image src={spaceOne} alt="Space Illustration" />
        <div className="flex flex-col justify-center items-center max-w-lg mx-auto">
          <h1 className="text-highlight font-bold text-3xl text-center mb-3">
            Hang on
          </h1>
          <p className="text-lg text-grayAlt">
            Something&apos;s not quite right here
          </p>
          <p className="text-lg text-grayAlt">Try again or check back later</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <CustomHead />
      <div className="grid grid-cols-12 gap-6">
        <section
          className={clx(
            "flex gap-5",
            !!followingCommunitiesQuery.data?.communities.length
              ? "col-span-full md:col-span-9"
              : "col-span-full",
          )}
        >
          <motion.div className="flex-1 pb-5 flex flex-col items-center gap-3">
            {postQuery.isLoading &&
              Array(13)
                .fill(0)
                .map((skeleton, idx) => <PostSkeleton key={idx} />)}

            {postQuery?.data?.posts &&
              postQuery.data.posts?.map((post) => (
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
              <div className="flex flex-col gap-5 justify-center items-center">
                <NotFound
                  heading="Hang On"
                  text="There doesn't seem to be anything on this side of the
                    universe"
                />

                <ButtonLink href="/submit" variant="primary">
                  Create Post
                </ButtonLink>
              </div>
            )}
          </motion.div>
        </section>
        {!!followingCommunitiesQuery.data?.communities.length && (
          <aside className="hidden lg:block md:col-start-10 md:col-span-full">
            <CommunitiesPanel
              title="Followed Communities"
              data={followingCommunitiesQuery.data}
            />
          </aside>
        )}
      </div>
    </>
  );
};

export default Home;
