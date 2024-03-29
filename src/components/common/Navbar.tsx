import React, { forwardRef, ReactNode } from "react";
import { Menu } from "@headlessui/react";
import { FiPlus } from "react-icons/fi";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { ThemeToggler } from "./ThemeToggler";
import CreateCommunityModal from "../communities/CreateCommunityModal";
import ButtonLink from "./ButtonLink";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

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

const Navbar: React.FC = () => {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  if (loading) return null;

  return (
    <nav className="flex justify-center items-center gap-3">
      {!session?.user && (
        <ButtonLink href="/signin" variant="primary" size="sm">
          Sign in
        </ButtonLink>
      )}
      {session?.user && (
        <>
          <CreateCommunityModal />
          <ButtonLink href="/submit" variant="primary" size="sm">
            <FiPlus size={16} />
            Create Post
          </ButtonLink>
        </>
      )}

      <Menu as={"div"} className="user-menu relative inline-block text-left">
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
                  <div className="p-2 font-semibold">
                    <Menu.Item as="div">
                      <ThemeToggler />
                    </Menu.Item>

                    {session?.user ? (
                      <>
                        <Menu.Item>
                          <DropdownLink href={`/user/${session?.user.id}`}>
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
                        <DropdownLink href="/signin">Sign In</DropdownLink>
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
  );
};

export default Navbar;
