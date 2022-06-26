import Image from "next/image";
import Markdown from "./Markdown";

interface Props {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}
const Comment: React.FC<Props> = ({
  id,
  content,
  createdAt,
  updatedAt,
  user,
}) => {
  return (
    <div className="bg-foreground flex gap-5 dark:bg-darkOne py-3 px-5 rounded-md">
      <div className="bg-darkTwo min-h-full min-w-[4px] rounded-full"></div>
      <div className="flex flex-col gap-5 flex-grow">
        <div className="flex items-center gap-3">
          <Image
            src={user?.image ?? ""}
            alt={user.name ? user.name : `${user.name} Avatar`}
            width={28}
            height={28}
            className="rounded-full"
            priority
          />
          <span className="text-grayAlt">{user.name}</span>
          {/* <span>{createdAt}</span> */}
        </div>
        <div>
          <Markdown content={content} />
        </div>
        <div className="flex items-center gap-2 text-grayAlt">
          <button>Upvote</button>
          <span>0</span>
          <button>Downvote</button>
        </div>
      </div>
    </div>
  );
};

export default Comment;
