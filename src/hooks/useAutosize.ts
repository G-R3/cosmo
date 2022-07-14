import { useEffect, useRef } from "react";

const minHeight = 200;

const useAutosize = (
  content: string | number | readonly string[] | undefined,
  height = minHeight,
) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      const scrollHeight = textareaRef.current.scrollHeight;

      textareaRef.current.style.height = `${Math.max(
        textareaRef.current.scrollHeight,
        height,
      )}px`;
    }
  }, [content, height]);

  return { textareaRef };
};

export default useAutosize;
