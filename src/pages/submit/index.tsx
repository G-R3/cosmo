import { useState, useRef, useEffect } from "react";
import { BiErrorCircle } from "react-icons/bi";
import { trpc } from "../../utils/trpc";
import { ComponentWithAuth } from "../../components/Auth";
// import PreviewModal from "../../components/PreviewModal";

const Submit: ComponentWithAuth = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [preview, setPreview] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mutation = trpc.useMutation("post.create");

  const handleSubmit = () => {
    mutation.mutate({ title, content });
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.max(
        textareaRef.current.scrollHeight,
        200,
      )}px`;
    }
  }, [content]);

  return (
    <div className={"flex"}>
      <section className={"w-full max-w-xl mx-auto"}>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold my-5">Create Post</h1>
        </div>
        <div className="flex flex-col gap-5 rounded-md">
          {mutation.error && (
            <div className="bg-error p-3 rounded-md text-foreground flex items-center gap-2">
              <BiErrorCircle size={22} />
              <span>Something has gone terrible wrong!</span>
            </div>
          )}
          <input
            type="text"
            placeholder="Hello World"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            className="p-4 rounded-md bg-whiteAlt text-darkTwo placeholder:text-slate-400 dark:bg-darkTwo dark:text-foreground  focus:outline-offset-2 focus:outline focus:outline-2 focus:outline-darkTwo dark:focus:outline-grayAlt transition-all"
          />
          <div className="grid after:content">
            <textarea
              ref={textareaRef}
              placeholder={`# Your Post \nLet the world know what you're thinking. Start with a title and then add some content to spice up your post! 😀`}
              onChange={(e) => {
                setContent(e.target.value);
              }}
              value={content}
              className="
              py-3 px-4 rounded-md bg-whiteAlt text-darkTwo placeholder:text-slate-400 dark:bg-darkTwo dark:text-foreground  focus:outline-offset-2 focus:outline focus:outline-2 focus:outline-darkTwo dark:focus:outline-grayAlt transition-all overflow-hidden min-h-[200px] resize-none"
            ></textarea>
          </div>

          <button
            onClick={handleSubmit}
            disabled={mutation.isLoading}
            className="bg-whiteAlt text-darkTwo self-end h-12 p-4 rounded-md flex items-center disabled:opacity-50 animate-popIn active:hover:animate-none active:focus:animate-none active:focus:scale-95 active:hover:scale-95 transition-all"
          >
            Post
          </button>
        </div>
      </section>
    </div>
  );
};

Submit.auth = {
  loader: <div>Loading...</div>,
};

export default Submit;
