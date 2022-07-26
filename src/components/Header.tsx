import { ReactNode, forwardRef } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu } from "@headlessui/react";
import { FiPlus } from "react-icons/fi";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { ThemeToggler } from "./ThemeToggler";
import CreateCommunityModal from "@/components/CreateCommunityModal";

interface Props {
  href: string;
  children: ReactNode;
}

const DropdownLink = forwardRef<HTMLAnchorElement, Props>((props, ref) => {
  let { href, children, ...rest } = props;
  return (
    <Link href={href}>
      <a
        ref={ref}
        {...rest}
        className="flex w-full rounded-md px-2 py-2 hover:bg-foreground text-sm dark:hover:bg-darkTwo"
      >
        {children}
      </a>
    </Link>
  );
});

DropdownLink.displayName = "DropdownLink";

const Header: React.FC = () => {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  if (loading) return null;

  return (
    <>
      <header
        className={`backdrop-saturate-50 backdrop-blur-sm fixed top-0 left-0 w-full z-10 transition-all duration-200 ease-in`}
      >
        <div className="relative px-5 h-14 lg:h-16 ">
          <div className="flex">
            <div className="flex-shrink-0">
              <Link href={"/"}>
                <a className="flex items-center h-14 lg:h-16 w-full text-3xl text-primary dark:text-secondary">
                  Cosmo
                </a>
              </Link>
            </div>
            <div className="flex gap-5 justify-end items-center flex-grow">
              <nav className="flex justify-center items-center gap-3">
                {!!session?.user && (
                  <>
                    <CreateCommunityModal />
                    <Link href="/submit">
                      <a
                        tabIndex={0}
                        className="flex items-center px-2 h-6 lg:h-8 cursor-pointer"
                      >
                        <FiPlus size={25} />
                      </a>
                    </Link>
                  </>
                )}

                <Menu
                  as={"div"}
                  className="user-menu relative inline-block text-left"
                >
                  {({ open }) => (
                    <>
                      <Menu.Button className="p-2 rounded-full">
                        {session?.user ? (
                          <div className="flex items-center bg-red-100 justify-center rounded-full outline outline-offset-2 outline-1 outline-highlight">
                            <span
                              style={{
                                backgroundImage: `url(${session?.user.image})`,
                              }}
                              className="w-8 h-8 bg-cover bg-no-repeat bg-center rounded-full outline-none cursor-pointer"
                            ></span>
                          </div>
                        ) : (
                          <div className="w-8 h-8 flex items-center bg-red-100 justify-center rounded-full outline outline-offset-2 outline-1 outline-highlight"></div>
                        )}
                      </Menu.Button>
                      <AnimatePresence>
                        {open && (
                          <Menu.Items
                            as={motion.div}
                            static
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{
                              type: "tween",
                              duration: 0.2,
                              ease: "easeInOut",
                            }}
                            className="border dark:border-darkTwo bg-whiteAlt dark:bg-darkOne absolute right-0 mt-2 w-56 rounded-md shadow-lg dark:ring-darkTwo origin-top-right"
                          >
                            <div className="p-2">
                              <Menu.Item as="div">
                                <ThemeToggler />
                              </Menu.Item>

                              {session?.user ? (
                                <>
                                  <Menu.Item>
                                    <DropdownLink
                                      href={`/user/${session?.user.id}`}
                                    >
                                      Profile
                                    </DropdownLink>
                                  </Menu.Item>
                                  <Menu.Item>
                                    <button
                                      onClick={() => signOut()}
                                      className="flex w-full rounded-md px-2 py-2 hover:bg-foreground text-sm dark:hover:bg-darkTwo"
                                    >
                                      Sign out
                                    </button>
                                  </Menu.Item>
                                </>
                              ) : (
                                <Menu.Item>
                                  <DropdownLink href="/signin">
                                    Sign In
                                  </DropdownLink>
                                </Menu.Item>
                              )}
                            </div>
                          </Menu.Items>
                        )}
                      </AnimatePresence>
                    </>
                  )}
                </Menu>
              </nav>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
