import { forwardRef, ReactNode } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu } from "@headlessui/react";
import { ThemeToggler } from "./ThemeToggler";

interface Props {
  href: string;
  children: ReactNode;
}
// eslint-disable-next-line react/display-name
const DropdownLink = forwardRef<HTMLAnchorElement, Props>((props, ref) => {
  let { href, children, ...rest } = props;
  return (
    <Link href={href}>
      <a
        ref={ref}
        {...rest}
        className="flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-whiteAlt dark:hover:bg-darkTwo"
      >
        {children}
      </a>
    </Link>
  );
});

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
              <a className="flex items-center h-14 lg:h-16 w-full text-3xl text-primary dark:text-secondary">
                Cosmo
              </a>
            </Link>
          </div>
          <div className="flex gap-5 justify-end items-center flex-grow">
            <nav className="flex justify-center items-center gap-5">
              <Link href="/submit">
                <a
                  tabIndex={0}
                  className="flex items-center px-2 h-6 lg:h-8 cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 outline-none"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </Link>

              {!session && (
                <Link href="/auth/signin">
                  <a className="flex items-center h-14 lg:h-16">Sign in</a>
                </Link>
              )}
              {!!session?.user && (
                <Menu as={"div"} className="relative inline-block text-left">
                  <Menu.Button className="p-2 rounded-full">
                    <div className="flex items-center bg-red-100 justify-center rounded-full outline outline-offset-2 outline-1 outline-highlight">
                      <span
                        style={{
                          backgroundImage: `url(${session.user.image})`,
                        }}
                        className="w-8 h-8 bg-cover bg-no-repeat bg-center rounded-full outline-none cursor-pointer"
                      ></span>
                    </div>
                  </Menu.Button>
                  <Menu.Items className="bg-foreground dark:bg-darkOne absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md shadow-lg focus:outline-none ring-1 dark:ring-darkTwo">
                    <div className="p-2">
                      <Menu.Item>{({ active }) => <ThemeToggler />}</Menu.Item>
                      <Menu.Item>
                        {!session ? (
                          <DropdownLink href="/auth/signin">
                            Sign in
                          </DropdownLink>
                        ) : (
                          <button
                            onClick={() => signOut()}
                            className="flex w-full items-center rounded-md px-2 py-2 hover:bg-whiteAlt text-sm dark:hover:bg-darkTwo"
                          >
                            Sign out
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Menu>
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
