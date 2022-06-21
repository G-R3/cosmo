import Link from "next/link";
import Markdown from "../components/Markdown";

interface Props {
  id: number;
  title: string;
  content?: string | null;
  slug?: string | null;
}

const Post: React.FC<Props> = ({ id, title, content, slug }) => {
  return (
    <div className="bg-neutral border-2 border-transparent hover:border-accent w-full rounded-md p-5 transition-all">
      <h2 className="text-xl font-semibold">{title}</h2>
      <span className="flex gap-2 mb-3">
        <small>Posted by</small>
        <small>Tuxedoed</small>
        <small>10 hrs ago</small>
      </span>
      <div className="ellipsis">
        <Markdown content={content ? content : ""} />
      </div>
      <div className="flex justify-between mt-3">
        <div className="flex justify-center items-center gap-2">
          <button>Upvote</button>
          <span>Vote</span>
          <button>Downvote</button>
        </div>

        <Link href={`/post/${slug}`}>
          <a>100 Comment</a>
        </Link>
      </div>
    </div>
  );
};

export default Post;
