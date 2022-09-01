import Link from "next/link";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import UserTabs from "@/components/user/UserTabs";
import UserBanner from "@/components/user/UserBanner";
import Preloader from "@/components/common/Preloader";
import CustomHead from "@/components/common/CustomHead";
import NotFound from "@/components/common/NotFound";
import ButtonLink from "@/components/common/ButtonLink";

const Profile: NextPage = () => {
  const router = useRouter();
  const userId = router.query.userId as string;
  const userQuery = trpc.useQuery(["user.get-by-id", { userId }]);
  // these two queries hit the same endpoint, by not providing the type of communities we want
  // isMember isModerator, the data gets gets messed up
  const communitiesQuery = trpc.useQuery([
    "user.get-communities",
    { userId, isModerator: true },
  ]);
  const followingCommunitiesQuery = trpc.useQuery([
    "user.get-communities",
    { userId, isMember: true },
  ]);

  if (
    userQuery.isLoading ||
    communitiesQuery.isLoading ||
    followingCommunitiesQuery.isLoading
  ) {
    return <Preloader />;
  }

  if (userQuery.error || !userQuery?.data?.user) {
    return (
      <div className="flex justify-center">
        <div className="flex flex-col gap-5 justify-center items-center">
          <NotFound
            heading="Woah!"
            text="No user was found in this current timeline"
          />
          <ButtonLink href="/" variant="primary">
            Return Home
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <>
      <CustomHead title={`${userQuery.data.user?.name} | Cosmo`} />
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-full md:col-start-1 md:col-end-10">
          <UserBanner
            id={userQuery.data.user.id}
            name={userQuery.data.user.name!}
            image={userQuery.data.user.image!}
            role={userQuery.data.user.role}
          />
          <div className="mt-48">
            <UserTabs user={userQuery.data.user?.id!} />
          </div>
        </div>
        {(communitiesQuery.data || followingCommunitiesQuery.data) && (
          <div className="hidden md:flex md:flex-col md:gap-y-3 md:col-start-10 md:col-span-full">
            {!!communitiesQuery.data?.communities.length && (
              <div className="bg-darkOne p-5 rounded-md">
                <h2 className="font-semibold mb-2">Communities Moderating</h2>
                <div className="space-y-3">
                  {communitiesQuery.data?.communities.map((community) => (
                    <div key={community.id} className="flex flex-col">
                      <Link href={`/community/${community.name}`}>
                        <a className=" font-semibold text-grayAlt">
                          {community.name}
                        </a>
                      </Link>
                      <span className="truncate">{community.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {!!followingCommunitiesQuery.data?.communities.length && (
              <div className="bg-darkOne p-5 rounded-md">
                <h2 className="font-semibold mb-2">
                  Member of these Communities
                </h2>
                <div className="space-y-3">
                  {followingCommunitiesQuery.data?.communities.map(
                    (community) => (
                      <div key={community.id} className="flex flex-col">
                        <Link href={`/community/${community.name}`}>
                          <a className=" font-semibold text-grayAlt">
                            {community.name}
                          </a>
                        </Link>
                        <span className="truncate">
                          {community.description}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
