import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface Props {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

const UserCard: React.FC<Props> = ({ name, email, image }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="sticky top-20 py-5 bg-whiteAlt dark:bg-darkOne rounded-md flex items-center justify-center"
    >
      <div className="flex flex-col items-center justify-center rounded-full">
        <motion.div
          className="w-24"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 15 }}
        >
          {/* TODO: set a default image */}
          {!!image && (
            <Image
              src={image}
              alt={name ? name : "Avatar"}
              width={112}
              height={112}
              className="rounded-full"
              priority
            />
          )}
        </motion.div>

        <div className="flex flex-col items-center mt-2">
          <span>{name}</span>
          <span>{email}</span>
        </div>
        <div className="flex flex-col gap-2 mt-5">
          <button className="bg-error text-whiteAlt h-10 p-4 w-full rounded-md flex items-center disabled:opacity-50 animate-popIn active:hover:animate-none active:focus:animate-none active:focus:scale-95 active:hover:scale-95 transition-all">
            Create community
          </button>
          <Link href={"/submit"}>
            <a className="bg-foreground text-darkOne h-10 p-4 w-full rounded-md flex items-center justify-center disabled:opacity-50 animate-popIn active:hover:animate-none active:focus:animate-none active:focus:scale-95 active:hover:scale-95 transition-all">
              Create Post
            </a>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default UserCard;
