import { ChangeEvent, ComponentPropsWithRef, useRef } from "react";

type customProps = {
  register: any;
};
type TextareaProps = customProps & ComponentPropsWithRef<"textarea">;

const TextareaAutosize = ({
  className,
  register,
  onChange = () => {},
  ...props
}: TextareaProps) => {
  const { ref, onChange: postOnChange, ...rest } = register("postContent");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const baseStyles = `py-3 px-4 border-2 focus:outline-none focus:border-grayAlt dark:focus:border-grayAlt rounded-md bg-whiteAlt dark:border-darkTwo text-darkTwo placeholder:text-grayAlt dark:bg-darkOne dark:text-foreground overflow-hidden resize-none`;

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      const scrollHeight = textareaRef.current.scrollHeight;

      textareaRef.current.style.height = `${Math.max(scrollHeight, 200)}px`;
    }

    postOnChange(e);
    onChange(e);
  };

  return (
    <textarea
      spellCheck="false"
      ref={(e) => {
        ref(e);
        textareaRef.current = e;
      }}
      className={`${baseStyles} ${className ? className : ""}`}
      onChange={handleChange}
      {...rest}
      {...props}
    ></textarea>
  );
};

export default TextareaAutosize;
