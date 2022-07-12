const CommentSkeleton = () => {
  return (
    <div className="bg-whiteAlt flex gap-5 dark:bg-darkOne py-3 px-5 rounded-md min-h-[168px]">
      <div className="bg-foreground dark:bg-darkTwo min-h-full min-w-[4px] rounded-full"></div>
      <div className="flex flex-col gap-5 flex-grow">
        <div className="flex items-center gap-3">
          {/* IMAGE HERE */}
          <div className="w-7 h-7 bg-skeleton dark:bg-skeletonDark bg-[length:400%_100%] animate-skeletonLoading rounded-full"></div>
          <span className="flex gap-2 mt-2 h-4 w-48 bg-skeleton dark:bg-skeletonDark bg-[length:400%_100%] animate-skeletonLoading rounded-sm"></span>
        </div>
        <div className="flex flex-col gap-4 mb-3">
          <p className="h-3 w-full bg-skeleton dark:bg-skeletonDark bg-[length:400%_100%] animate-skeletonLoading rounded-sm"></p>
          <p className="h-3 w-full bg-skeleton dark:bg-skeletonDark bg-[length:400%_100%] animate-skeletonLoading rounded-sm"></p>
          <p className="h-3 w-full bg-skeleton dark:bg-skeletonDark bg-[length:400%_100%] animate-skeletonLoading rounded-sm"></p>
        </div>
      </div>
    </div>
  );
};

export default CommentSkeleton;
