import { FC, Fragment, useState } from "react";
import { Tab } from "@headlessui/react";
import { trpc } from "@/utils/trpc";
import useLike from "@/hooks/useLike";
import PostSkeleton from "./PostSkeleton";
import Post from "./Post";
import CommentSkeleton from "./CommentSkeleton";
import Comment from "./Comment";

const UserTabs: FC<{ user: string }> = ({ user }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const postQuery = trpc.useQuery(["user.get-posts", { user }], {
    enabled: selectedTab === 0,
  });
  const likedPostQuery = trpc.useQuery(["user.get-liked-posts", { user }]);
  const commentQuery = trpc.useQuery(["user.get-comments", { user }]);
  const { onLike, onUnlike } = useLike("user.get-posts", {
    user,
    index: selectedTab,
  });

  return (
    <Tab.Group manual selectedIndex={selectedTab} onChange={setSelectedTab}>
      <Tab.List className="flex gap-8">
        <Tab as={Fragment}>
          {({ selected }) => (
            <button
              className={`font-semibold text-lg ${
                selected ? "text-whiteAlt" : "text-grayAlt"
              }`}
            >
              Posts
            </button>
          )}
        </Tab>
        <Tab as={Fragment}>
          {({ selected }) => (
            <button
              className={`font-semibold text-lg ${
                selected ? "text-whiteAlt" : "text-grayAlt"
              }`}
            >
              Liked Posts
            </button>
          )}
        </Tab>
        <Tab as={Fragment}>
          {({ selected }) => (
            <button
              className={`font-semibold text-lg ${
                selected ? "text-whiteAlt" : "text-grayAlt"
              }`}
            >
              Comments
            </button>
          )}
        </Tab>
      </Tab.List>
      <Tab.Panels>
        <Tab.Panel>
          <div className="flex flex-col gap-6 mt-6">
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
                />
              ))}
          </div>
        </Tab.Panel>
        <Tab.Panel>
          <div className="flex flex-col gap-6 mt-6">
            {likedPostQuery.isLoading &&
              Array(13)
                .fill(0)
                .map((skeleton, idx) => <PostSkeleton key={idx} />)}

            {likedPostQuery?.data?.posts &&
              likedPostQuery.data.posts?.map((post) => (
                <Post
                  key={post.id}
                  {...post}
                  onLike={onLike}
                  onUnlike={onUnlike}
                />
              ))}
          </div>
        </Tab.Panel>
        <Tab.Panel className="flex flex-col gap-6 mt-6">
          {commentQuery.isLoading &&
            Array(13)
              .fill(0)
              .map((skeleton, idx) => <CommentSkeleton key={idx} />)}
          {commentQuery.data?.comments.map((comment) => (
            <Comment key={comment.id} {...comment} />
          ))}
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
};

export default UserTabs;
