import { NextPage } from "next";
import ButtonLink from "@/components/common/ButtonLink";

const NotFound: NextPage = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-10 h-full">
      <div className="flex flex-col md:flex-row gap-x-6">
        <h1 className="text-7xl font-bold text-highlight">404</h1>
        <div className="w-px min-h-full bg-zinc-300 dark:bg-darkTwo hidden md:block"></div>
        <div className="flex flex-col gap-3">
          <p className="text-7xl font-bold">Page not found</p>
          <p className="text-lg text-grayAlt">
            Hang on space cowboy! seems you&apos;re lost, the place you
            requested couldn&apos;t be found
          </p>
        </div>
      </div>
      <ButtonLink href="/" variant="primary">
        Return Home
      </ButtonLink>
    </div>
  );
};

export default NotFound;
