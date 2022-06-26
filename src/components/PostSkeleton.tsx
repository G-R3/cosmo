import { motion } from "framer-motion";

const variants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const PostSkeleton = () => {
  return (
    <motion.div
      variants={variants}
      className="bg-grayAlt dark:bg-darkOne w-full rounded-md p-5 max-h-[168px]"
    >
      <div>
        <h2 className="bg-skeleton dark:bg-skeletonDark bg-[length:400%_100%] animate-skeletonLoading rounded-md h-5 w-full"></h2>
        <span className="flex gap-2 mt-2 mb-3 h-2 w-48 bg-skeleton dark:bg-skeletonDark bg-[length:400%_100%] animate-skeletonLoading rounded-sm"></span>
        <div className="flex flex-col gap-2 my-4">
          <p className="h-2 w-full bg-skeleton dark:bg-skeletonDark bg-[length:400%_100%] animate-skeletonLoading rounded-sm"></p>
          <p className="h-2 w-full bg-skeleton dark:bg-skeletonDark bg-[length:400%_100%] animate-skeletonLoading rounded-sm"></p>
          <p className="h-2 w-full bg-skeleton dark:bg-skeletonDark bg-[length:400%_100%] animate-skeletonLoading rounded-sm"></p>
        </div>
        <div className="flex justify-between mt-3">
          <div className="flex justify-center items-center gap-2">
            <span className="h-5 w-12 bg-skeleton dark:bg-skeletonDark bg-[length:400%_100%] animate-skeletonLoading rounded-md"></span>
            <span className="h-5 w-12 bg-skeleton dark:bg-skeletonDark bg-[length:400%_100%] animate-skeletonLoading rounded-md"></span>
            <span className="h-5 w-12 bg-skeleton dark:bg-skeletonDark bg-[length:400%_100%] animate-skeletonLoading rounded-md"></span>
          </div>

          <span className="h-5 w-36 bg-skeleton dark:bg-skeletonDark bg-[length:400%_100%] animate-skeletonLoading rounded-md"></span>
        </div>
      </div>
    </motion.div>
  );
};

export default PostSkeleton;
