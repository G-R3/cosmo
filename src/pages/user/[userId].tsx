import { trpc } from "@/utils/trpc";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import UserTabs from "@/components/UserTabs";

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
          <div className="relative col-span-full md:col-start-1 md:col-end-10 py-5">
            <div className="bg-red-500 h-44 w-full absolute top-0 left-0 rounded-md"></div>
            <div className="relative top-24 flex items-center gap-4 px-5">
              <Image
                src={userQuery.data.user?.image!}
                alt={`${userQuery.data.user?.name}'s Avatar`}
                width={150}
                height={150}
                className="rounded-full"
                priority
              />
              <h1 className="text-2xl font-semibold mt-6">
                {userQuery.data.user?.name}
              </h1>
            </div>
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
