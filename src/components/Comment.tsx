import Image from "next/image";
import Markdown from "./Markdown";

interface Props {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  author: {
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
  author,
}) => {
  return (
    <div className="bg-whiteAlt flex gap-5 dark:bg-darkOne py-3 px-5 rounded-md">
      <div className="bg-foreground dark:bg-darkTwo min-h-full min-w-[4px] rounded-full"></div>
      <div className="flex flex-col gap-5 flex-grow">
        <div className="flex items-center gap-3">
          <Image
            src={author?.image ?? ""}
            alt={author.name ? author.name : `${author.name} Avatar`}
            width={28}
            height={28}
            className="rounded-full"
            priority
          />
          <span className="text-grayAlt">{author.name}</span>
          {/* <span>{createdAt}</span> */}
        </div>
        <div className="mb-5">
          <Markdown content={content} />
        </div>
      </div>
    </div>
  );
};

export default Comment;
