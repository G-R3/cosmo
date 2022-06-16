import type { NextPage } from "next";

const Submit: NextPage = () => {
  return (
    <section className="max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold my-10">Create Post</h1>
      <div className="bg-white p-5 flex flex-col gap-2 rounded-md">
        <input
          type="text"
          placeholder="Title"
          className="w-full py-2 px-3 border-2 rounded-md"
        />
        <textarea
          placeholder="Text (optional)"
          className="w-full py-2 px-3 border-2 rounded-md"
        ></textarea>

        <button className="bg-blue-500 text-white rounded-md p-2 self-end">
          Post
        </button>
      </div>
    </section>
  );
};

export default Submit;
