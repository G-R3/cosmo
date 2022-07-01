import { useState } from "react";
import { useRouter } from "next/router";
import { BiErrorCircle } from "react-icons/bi";
import { trpc } from "../../utils/trpc";
import { ComponentWithAuth } from "../../components/Auth";
import useTextarea from "../../hooks/useTextarea";
// import PreviewModal from "../../components/PreviewModal";

const Submit: ComponentWithAuth = () => {
  // const utils = trpc.useContext();
  const [title, setTitle] = useState<string>("");
  const { content, setContent, textareaRef } = useTextarea("");
  // const [preview, setPreview] = useState<boolean>(false);
  const router = useRouter();
  const mutation = trpc.useMutation("post.create", {
    onSuccess(input) {
      // utils.invalidateQueries(["post.all"]);
      router.push("/");
    },
  });

  const handleSubmit = () => {
    mutation.mutate({ title, content });
  };

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
            data-cy="submit"
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
