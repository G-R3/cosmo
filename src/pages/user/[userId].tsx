import { NextPage } from "next";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import UserTabs from "@/components/user/UserTabs";
import UserBanner from "@/components/user/UserBanner";
import Preloader from "@/components/common/Preloader";
import CustomHead from "@/components/common/CustomHead";

const Profile: NextPage = () => {
  const router = useRouter();
  const userId = router.query.userId as string;
  const userQuery = trpc.useQuery(["user.get-by-id", { userId }]);

  if (userQuery.isLoading) {
    return <Preloader />;
  }

  if (userQuery.error || !userQuery?.data?.user) {
    return <div>No user was found</div>;
  }

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
        <div className="hidden md:block md:col-start-10 md:col-span-full">
          <h2 className="font-bold p-5 text-grayAlt">Joined Communities</h2>
        </div>
      </div>
    </>
  );
};

export default Profile;
