import { FC, Fragment, useState } from "react";
import { Tab } from "@headlessui/react";
import { useSession } from "next-auth/react";
import UserPosts from "./UserPosts";
import UserLikedPosts from "./UserLikedPosts";
import UserComments from "./UserComments";
import UserSavedPosts from "./UserSavedPosts";

// Ok, so I clean this up a bit
// I still think this component is cursed
// some of them render the exact same thing, the only thing that changes is the isSelected prop and
// the query used to fetch.

const UserTabs: FC<{ user: string }> = ({ user }) => {
  const { data: session } = useSession();
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <Tab.Group manual selectedIndex={selectedTab} onChange={setSelectedTab}>
      <Tab.List className="flex gap-8">
        <Tab as={Fragment}>
          {({ selected }) => (
            <button
              className={`font-semibold text-sm ${
                selected ? "text-darkOne dark:text-whiteAlt" : "text-grayAlt"
              }`}
            >
              Posts
            </button>
          )}
        </Tab>
        {session?.user.id === user && (
          <Tab as={Fragment}>
            {({ selected }) => (
              <button
                className={`font-semibold text-sm ${
                  selected ? "text-darkOne dark:text-whiteAlt" : "text-grayAlt"
                }`}
              >
                Liked Posts
              </button>
            )}
          </Tab>
        )}
        <Tab as={Fragment}>
          {({ selected }) => (
            <button
              className={`font-semibold text-sm ${
                selected ? "text-darkOne dark:text-whiteAlt" : "text-grayAlt"
              }`}
            >
              Comments
            </button>
          )}
        </Tab>
        {session?.user.id === user && (
          <Tab as={Fragment}>
            {({ selected }) => (
              <button
                className={`font-semibold text-sm ${
                  selected ? "text-darkOne dark:text-whiteAlt" : "text-grayAlt"
                }`}
              >
                Saved posts
              </button>
            )}
          </Tab>
        )}
      </Tab.List>
      <Tab.Panels>
        <Tab.Panel className="flex flex-col gap-6 mt-6">
          <UserPosts user={user} isSelected={selectedTab === 0} />
        </Tab.Panel>
        <Tab.Panel className="flex flex-col gap-6 mt-6">
          <UserLikedPosts user={user} isSelected={selectedTab === 1} />
        </Tab.Panel>
        <Tab.Panel className="flex flex-col gap-6 mt-6">
          <UserComments user={user} isSelected={selectedTab === 2} />
        </Tab.Panel>
        <Tab.Panel className="flex flex-col gap-6 mt-6">
          <UserSavedPosts user={user} isSelected={selectedTab === 3} />
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
};

export default UserTabs;
