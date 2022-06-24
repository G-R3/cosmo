import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

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
                <a className="flex items-center h-14 lg:h-16 cursor-pointer focus:outline-none">
                  <div
                    className="tooltip tooltip-bottom"
                    data-tip="Create Post"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </a>
              </Link>

              {!session && (
                <Link href="/auth/signin">
                  <a className="flex items-center h-14 lg:h-16">Sign in</a>
                </Link>
              )}
            </nav>
            {!!session?.user && (
              <div className="dropdown dropdown-end">
                <div className="flex items-center justify-center rounded-full outline outline-offset-2 outline-1 outline-accent">
                  <span
                    tabIndex={0}
                    style={{
                      backgroundImage: `url(${session.user.image})`,
                    }}
                    className="w-8 h-8 bg-cover bg-no-repeat bg-center rounded-full outline-none"
                  ></span>
                </div>
                <ul
                  tabIndex={0}
                  className="menu dropdown-content p-2 shadow bg-neutral rounded-box w-52 mt-2"
                >
                  <li>
                    <a>TODO: Profile</a>
                  </li>
                  <li>
                    <button onClick={() => signOut({ callbackUrl: "/" })}>
                      Sign out
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
