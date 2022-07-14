import { ComponentPropsWithRef } from "react";
import useAutosize from "@/hooks/useAutosize";

type customProps = {
  minHeight?: number;
};
type TextareaProps = customProps & ComponentPropsWithRef<"textarea">;

const TextareaAutosize = ({
  value,
  className,
  minHeight = 200,
  ...props
}: TextareaProps) => {
  const { textareaRef } = useAutosize(value, minHeight);

  const baseStyles = `py-3 px-4 border-2 focus:outline-none focus:border-grayAlt dark:focus:border-grayAlt rounded-md bg-whiteAlt dark:border-darkTwo text-darkTwo placeholder:text-grayAlt dark:bg-darkOne dark:text-foreground overflow-hidden resize-none`;

  return (
    <textarea
      ref={textareaRef}
      value={value}
      className={`${baseStyles} ${className}`}
      {...props}
    ></textarea>
  );
};

export default TextareaAutosize;
