import { motion } from "framer-motion";

const variants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const PostSkeleton = () => {
  return (
    <motion.div
      variants={variants}
      className="bg-neutral border-2 border-transparent hover:border-accent w-full rounded-md p-5 transition-all max-h-[168px]"
    >
      <div className="animate-pulse">
        <h2 className="text-xl font-semibold bg-neutral-content brightness-50 rounded-md h-6 w-full"></h2>
        <span className="flex gap-2 mt-2 mb-3 h-2 w-48 bg-neutral-content brightness-50 rounded-md"></span>
        <div className="flex flex-col gap-2 my-4">
          <p className="h-2 w-full bg-neutral-content brightness-50 rounded-md"></p>
          <p className="h-2 w-full bg-neutral-content brightness-50 rounded-md"></p>
          <p className="h-2 w-full bg-neutral-content brightness-50 rounded-md"></p>
          {/* <Markdown content={content ? content : ""} /> */}
        </div>
        <div className="flex justify-between mt-3">
          <div className="flex justify-center items-center gap-2">
            <button className="h-5 w-12 bg-neutral-content brightness-50 rounded-md"></button>
            <span className="h-5 w-12 bg-neutral-content brightness-50 rounded-md"></span>
            <button className="h-5 w-12 bg-neutral-content brightness-50 rounded-md"></button>
          </div>

          <span className="h-5 w-36 bg-neutral-content brightness-50 rounded-md"></span>
        </div>
      </div>
    </motion.div>
  );
};

export default PostSkeleton;
