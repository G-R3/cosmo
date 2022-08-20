import Link from "next/link";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import UserTabs from "@/components/user/UserTabs";
import UserBanner from "@/components/user/UserBanner";
import Preloader from "@/components/common/Preloader";
import CustomHead from "@/components/common/CustomHead";
import NotFound from "@/components/common/NotFound";

const Profile: NextPage = () => {
  const router = useRouter();
  const userId = router.query.userId as string;
  const userQuery = trpc.useQuery(["user.get-by-id", { userId }]);
  const communitiesQuery = trpc.useQuery(["user.get-communities", { userId }]);

  if (userQuery.isLoading || communitiesQuery.isLoading) {
    return <Preloader />;
  }

  if (userQuery.error || !userQuery?.data?.user) {
    return (
      <div className="flex justify-center">
        <div className="flex flex-col gap-8 justify-center items-center">
          <NotFound
            heading="Woah!"
            text="No user was found in this current timeline"
          />
          <Link href={"/"}>
            <a className="bg-highlight text-whiteAlt h-10 p-4 w-full rounded-md flex items-center justify-center disabled:opacity-50 animate-popIn active:hover:animate-none active:focus:animate-none active:focus:scale-95 active:hover:scale-95 transition-all">
              Return Home
            </a>
          </Link>
        </div>
      </div>
    );
  }

  console.log(communitiesQuery.data);
  return (
    <>
      <CustomHead title={`${userQuery.data.user?.name} | Cosmo`} />
      <div className="grid grid-cols-12 gap-2">
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
        <div className="hidden md:flex md:flex-col md:gap-y-3 md:col-start-10 md:col-span-full">
          <div className="bg-darkOne p-5 rounded-md">
            <h2 className="font-semibold mb-2">Communities Moderating</h2>
            {communitiesQuery.data?.communities.map((community) => (
              <div key={community.id}>
                <Link href={`/c/${community.title}`}>
                  <a className=" font-semibold text-highlight">
                    {community.title}
                  </a>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
