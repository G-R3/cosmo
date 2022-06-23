import React from "react";
import Image from "next/image";
import Link from "next/link";

interface Props {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

const UserCard: React.FC<Props> = ({ name, email, image }) => {
  return (
    <div className="sticky top-20 py-5 bg-neutral rounded-md flex items-center justify-center">
      <div className="flex flex-col items-center justify-center rounded-full">
        <div className="avatar">
          <div className="w-24 rounded-full">
            {/* TODO: set a default image */}
            {!!image && (
              <Image
                src={image}
                alt={name ? name : "Avatar"}
                width={112}
                height={112}
                priority
              />
            )}
          </div>
        </div>
        <div className="flex flex-col items-center mt-2">
          <span>{name}</span>
          <span>{email}</span>
        </div>
        <div className="flex flex-col gap-2 mt-5">
          <button className="btn btn-primary btn-sm text-xs rounded-md">
            Create Community
          </button>
          <Link href={"/submit"}>
            <a className="btn btn-secondary btn-sm text-xs text-base-100 rounded-md">
              Create Post
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
