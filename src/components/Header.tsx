import Link from "next/link";
import Image from "next/image";
import { useSession, signIn, signOut, getProviders } from "next-auth/react";

const Header: React.FC = () => {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  return (
    <header
      className={`backdrop-saturate-50 backdrop-blur-sm fixed top-0 left-0 w-full z-10 transition-all duration-200 ease-in ${
        !session && loading ? "-top-8 opacity-0" : "top-0 opacity-1"
      }`}
    >
      <div className="relative px-8 h-14 lg:h-16 ">
        <div className="flex">
          <div className="flex-shrink-0">
            <Link href={"/"}>
              <a className="flex items-center h-14 lg:h-16 w-full text-3xl">
                Cosmo
              </a>
            </Link>
          </div>
          <div className="flex gap-5 justify-end items-center flex-grow">
            <nav className={`flex gap-5`}>
              <Link href="/submit">
                <a className="flex items-center h-14 lg:h-16">Create Post</a>
              </Link>

              {session ? (
                <button
                  onClick={() => signOut()}
                  className="flex items-center h-14 lg:h-16"
                >
                  Sign out
                </button>
              ) : (
                <button
                  onClick={() => signIn()}
                  className="flex items-center h-14 lg:h-16"
                >
                  Sign in
                </button>
              )}
            </nav>
            {!!session?.user && (
              <div className="flex items-center justify-center rounded-full outline outline-offset-2 outline-1 outline-accent">
                <span
                  style={{
                    backgroundImage: `url(${session.user.image})`,
                  }}
                  className="w-8 h-8 bg-cover bg-no-repeat bg-center rounded-full"
                ></span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
