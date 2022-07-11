import { useState, FC, Dispatch, SetStateAction } from "react";
import { useRouter } from "next/router";
import { BiErrorCircle } from "react-icons/bi";
import { AiOutlineQuestion } from "react-icons/ai";
import { AnimatePresence } from "framer-motion";
import { trpc } from "../../utils/trpc";
import useTextarea from "../../hooks/useTextarea";
import SearchCommunity from "../../components/SearchCommunity";
import MarkdownHelpModal from "@/components/MarkdownHelpModal";

const Submit = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [community, setCommunity] = useState("");
  const { content, setContent, textareaRef } = useTextarea("");
  const router = useRouter();
  const mutation = trpc.useMutation("post.create", {
    onSuccess(input) {
      // should redirect to the post page
      router.push("/");
    },
  });

  const handleSubmit = () => {
    mutation.mutate({ title, content, community });
  };

  return (
    <section className="w-full max-w-xl mx-auto flex flex-col gap-10">
      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold">Create Post</h1>
        <span className="mt-2 text-grayAlt">
          Join the fun and share something exiting
        </span>
      </div>
      <div className="flex flex-col gap-5 rounded-md">
        {mutation.error && (
          <div className="bg-error p-3 rounded-md text-foreground flex items-center gap-2">
            <BiErrorCircle size={22} />
            <span>Something has gone terrible wrong!</span>
          </div>
        )}

        <SearchCommunity value={community} setValue={setCommunity} />
        <input
          data-cy="post-title"
          type="text"
          placeholder="Hello World"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          className="border-2 focus:outline-none focus:border-grayAlt dark:focus:border-grayAlt rounded-md p-4 bg-whiteAlt dark:border-darkTwo text-darkTwo placeholder:text-grayAlt dark:bg-darkOne dark:text-foreground"
        />
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 text-grayAlt cursor-pointer w-fit"
          >
            Markdown Supported
            <AiOutlineQuestion
              size={18}
              className="border rounded-full border-grayAlt"
            />
          </button>
          <textarea
            data-cy="post-body"
            ref={textareaRef}
            placeholder={`# Your Post \nLet the world know what you're thinking. Start with a title and then add some content to spice up your post! 😀`}
            onChange={(e) => {
              setContent(e.target.value);
            }}
            value={content}
            className="border-2 focus:outline-none focus:border-grayAlt dark:focus:border-grayAlt rounded-md py-3 px-4 bg-whiteAlt dark:border-darkTwo text-darkTwo placeholder:text-grayAlt dark:bg-darkOne dark:text-foreground overflow-hidden min-h-[200px] resize-none"
          ></textarea>
        </div>

        <button
          data-cy="submit"
          onClick={handleSubmit}
          disabled={mutation.isLoading}
          className="bg-whiteAlt text-darkOne self-end h-12 p-4 rounded-md flex items-center disabled:opacity-50 animate-popIn active:hover:animate-none active:focus:animate-none active:focus:scale-95 active:hover:scale-95 transition-all"
        >
          Post
        </button>
      </div>

      <AnimatePresence>
        {isOpen && <MarkdownHelpModal isOpen={isOpen} setIsOpen={setIsOpen} />}
      </AnimatePresence>
    </section>
  );
};

Submit.auth = true;

export default Submit;
