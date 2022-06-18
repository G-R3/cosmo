import type { NextPage } from "next";
import { useState, useRef, useEffect } from "react";
import { trpc } from "../../utils/trpc";
import PreviewPost from "../../components/PreviewPost";

const Submit: NextPage = () => {
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
        100,
      )}px`;
    }
  }, [content]);

  return (
    <div className={preview ? `grid grid-cols-2 gap-10` : ""}>
      <section className={preview ? "w-full" : "max-w-xl mx-auto"}>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold my-5">Create Post</h1>
          <button className="btn" onClick={() => setPreview((prev) => !prev)}>
            Preview post
          </button>
        </div>
        <div className="flex flex-col gap-2 rounded-md">
          {mutation.error && (
            <div className="alert alert-error shadow-lg">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current flex-shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-white">
                  Something has gone terrible wrong!
                </span>
              </div>
            </div>
          )}
          <input
            type="text"
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            className="input input-bordered rounded-md"
          />
          <div className="grid after:content">
            <textarea
              ref={textareaRef}
              placeholder="Text (optional)"
              onChange={(e) => {
                setContent(e.target.value);
              }}
              value={content}
              className="textarea textarea-bordered rounded-md overflow-hidden min-h-[100px] resize-none"
            ></textarea>
          </div>

          <button
            onClick={handleSubmit}
            disabled={mutation.isLoading}
            className="btn btn-primary self-end rounded-md"
          >
            Post
          </button>
        </div>
      </section>
      {preview && <PreviewPost title={title} content={content} />}
    </div>
  );
};

export default Submit;
