import { useEffect, useRef } from "react";

const useAutosize = (
  content: string | number | readonly string[] | undefined,
  height: number,
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
