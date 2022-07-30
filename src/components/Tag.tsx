import { ComponentPropsWithoutRef, FC } from "react";

type Tag = ComponentPropsWithoutRef<"button"> & {
  label: string;
  icon?: JSX.Element;
};

const Tag: FC<Tag> = ({ label, icon, ...props }) => {
  return (
    <button
      title={label}
      className="flex items-center gap-x-2 px-2 bg-whiteAlt text-darkOne border dark:border-grayAlt rounded-full hover:bg-gray-200"
      {...props}
    >
      {label}
      {icon}
    </button>
  );
};

export default Tag;
