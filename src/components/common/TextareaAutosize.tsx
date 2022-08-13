import { ChangeEvent, ComponentPropsWithRef, useEffect, useRef } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

type customProps = {
  register: UseFormRegisterReturn<string>;
  minHeight?: number;
};
type TextareaProps = customProps & ComponentPropsWithRef<"textarea">;

const TextareaAutosize = ({
  className,
  register,
  minHeight = 200,
  ...props
}: TextareaProps) => {
  const { ref, onChange: registerOnChange, ...rest } = register;
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const baseStyles = `py-3 px-4 border-2 focus:outline-none focus:border-grayAlt dark:focus:border-grayAlt rounded-md bg-whiteAlt dark:border-darkTwo text-darkTwo placeholder:text-grayAlt dark:bg-darkOne dark:text-foreground overflow-hidden resize-none`;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      const scrollHeight = textareaRef.current.scrollHeight;

      textareaRef.current.style.height = `${Math.max(
        scrollHeight,
        minHeight,
      )}px`;
    }
  }, [textareaRef, minHeight]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      const scrollHeight = textareaRef.current.scrollHeight;

      textareaRef.current.style.height = `${Math.max(
        scrollHeight,
        minHeight,
      )}px`;
    }

    registerOnChange(e);
    if (props.onChange) {
      props.onChange(e);
    }
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
      style={{
        ...props.style,
        minHeight: minHeight,
      }}
      {...props}
      {...rest}
    ></textarea>
  );
};

export default TextareaAutosize;
