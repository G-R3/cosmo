import { FC, Fragment, useState } from "react";
import { Tab } from "@headlessui/react";
import { trpc } from "@/utils/trpc";
import useLike from "@/hooks/useLike";
import PostSkeleton from "./PostSkeleton";
import Post from "./Post";
import CommentSkeleton from "./CommentSkeleton";
import Comment from "./Comment";
import { useSession } from "next-auth/react";
import useSavePost from "@/hooks/useSavePost";

// this is a cursed component o.O

const UserTabs: FC<{ user: string }> = ({ user }) => {
  const { data: session } = useSession();
  const [selectedTab, setSelectedTab] = useState(0);
  const postQuery = trpc.useQuery(["user.get-posts", { user }], {
    enabled: selectedTab === 0,
    cacheTime: 0,
  });
  const likedPostQuery = trpc.useQuery(["user.get-liked-posts", { user }], {
    enabled: selectedTab === 1,
    cacheTime: 0,
  });
  const commentQuery = trpc.useQuery(["user.get-comments", { user }], {
    enabled: selectedTab === 2,
    cacheTime: 0,
  });
  const savedPostQuery = trpc.useQuery(["user.get-saved-posts", { user }], {
    enabled: selectedTab === 3,
    cacheTime: 0,
  });

  // lol
  const { onLike, onUnlike } = useLike("user.get-posts", { user });
  const { onLike: onLikeLikedPost, onUnlike: onUnlikeLikedPost } = useLike(
    "user.get-liked-posts",
    { user },
  );
  const { onSave, onUnsave } = useSavePost("user.get-posts", { user });

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
            <div className="flex flex-col items-center text-grayAlt">
              <p className="font-bold text-lg mt-6">Its empty here</p>
              <p className="text-xl">😢</p>
            </div>
          )}
        </Tab.Panel>
        <Tab.Panel className="flex flex-col gap-6 mt-6">
          {likedPostQuery.isLoading &&
            Array(13)
              .fill(0)
              .map((skeleton, idx) => <PostSkeleton key={idx} />)}

          {likedPostQuery?.data?.posts &&
            likedPostQuery.data.posts?.map((post) => (
              <Post
                key={post.id}
                {...post}
                onLike={onLikeLikedPost}
                onUnlike={onUnlikeLikedPost}
                onSave={onSave}
                onUnsave={onUnsave}
              />
            ))}
          {likedPostQuery.data?.posts.length === 0 && (
            <div className="flex flex-col items-center text-grayAlt">
              <p className="font-bold text-lg mt-6">Its empty here</p>
              <p className="text-xl">😢</p>
            </div>
          )}
        </Tab.Panel>
        <Tab.Panel className="flex flex-col gap-6 mt-6">
          {commentQuery.isLoading &&
            Array(13)
              .fill(0)
              .map((skeleton, idx) => <CommentSkeleton key={idx} />)}
          {commentQuery.data?.comments.map((comment) => (
            <Comment key={comment.id} {...comment} />
          ))}
          {commentQuery.data?.comments.length === 0 && (
            <div className="flex flex-col items-center text-grayAlt">
              <p className="font-bold text-lg mt-6">Its empty here</p>
              <p className="text-xl">😢</p>
            </div>
          )}
        </Tab.Panel>
        <Tab.Panel className="flex flex-col gap-6 mt-6">
          {savedPostQuery.isLoading &&
            Array(13)
              .fill(0)
              .map((skeleton, idx) => <PostSkeleton key={idx} />)}

          {savedPostQuery?.data?.posts &&
            savedPostQuery.data.posts?.map((post) => (
              <Post
                key={post.id}
                {...post}
                onLike={onLike}
                onUnlike={onUnlike}
                onSave={onSave}
                onUnsave={onUnsave}
              />
            ))}
          {savedPostQuery.data?.posts.length === 0 && (
            <div className="flex flex-col items-center text-grayAlt">
              <p className="font-bold text-lg mt-6">Its empty here</p>
              <p className="text-xl">😢</p>
            </div>
          )}
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
};

export default UserTabs;
