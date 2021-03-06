import { trpc } from "@/utils/trpc";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import UserTabs from "@/components/UserTabs";
import UserBanner from "@/components/UserBanner";

const Profile = () => {
  const router = useRouter();
  const userId = router.query.userId as string;
  const userQuery = trpc.useQuery(["user.get-by-id", { userId }]);

  if (userQuery.data) {
    return (
      <>
        <Head>
          <title>{userQuery.data.user?.name} - Cosmo</title>
        </Head>
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-full md:col-start-1 md:col-end-10">
            <UserBanner
              id={userQuery.data.user?.id!}
              imageSrc={userQuery.data.user?.image!}
              displayName={userQuery.data.user?.name!}
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
  }
};

export default Profile;
