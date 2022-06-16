import type { NextPage } from "next";
import { useState } from "react";
import { trpc } from "../../utils/trpc";

const Submit: NextPage = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const mutation = trpc.useMutation("post.create");

  const handleSubmit = () => {
    mutation.mutate({ title, content });
  };

  return (
    <section className="max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold my-10">Create Post</h1>
      <div className="bg-white p-5 flex flex-col gap-2 rounded-md">
        {mutation.error && (
          <p className="bg-red-400 text-white p-3 rounded-md">
            Something went wrong!
          </p>
        )}
        <input
          type="text"
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          className="w-full py-2 px-3 border-2 rounded-md"
        />
        <textarea
          placeholder="Text (optional)"
          onChange={(e) => setContent(e.target.value)}
          value={content}
          className="w-full py-2 px-3 border-2 rounded-md"
        ></textarea>

        <button
          onClick={handleSubmit}
          disabled={mutation.isLoading}
          className="bg-blue-500 text-white rounded-md p-2 self-end"
        >
          Post
        </button>
      </div>
    </section>
  );
};

export default Submit;
