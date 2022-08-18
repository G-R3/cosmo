import { NextPage } from "next";
import Link from "next/link";

const NotFound: NextPage = () => {
  return (
    // TODO: its not exactly centered on page because layout padding top. adding -mt-16 fixes it i think
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
      <Link href={"/"}>
        <a className="bg-highlight text-whiteAlt h-10 p-4 rounded-md flex items-center justify-center disabled:opacity-50 animate-popIn active:hover:animate-none active:focus:animate-none active:focus:scale-95 active:hover:scale-95 transition-all">
          Return Home
        </a>
      </Link>
    </div>
  );
};

export default NotFound;
