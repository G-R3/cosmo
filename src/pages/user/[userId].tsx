import { trpc } from "@/utils/trpc";
import Head from "next/head";
import { useRouter } from "next/router";
import UserTabs from "@/components/User/UserTabs";
import UserBanner from "@/components/User/UserBanner";
import { NextPage } from "next";

const Profile: NextPage = () => {
  const router = useRouter();
  const userId = router.query.userId as string;
  const userQuery = trpc.useQuery(["user.get-by-id", { userId }]);

  if (userQuery.isLoading) return <div>Loading...</div>;

  if (userQuery.error || !userQuery?.data?.user) {
    return <div>No user was found</div>;
  }

  return (
    <>
      <Head>
        <title>{userQuery.data.user?.name} | Cosmo</title>
        <meta
          name="description"
          content="A place to create communities and discuss"
        />
      </Head>
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
