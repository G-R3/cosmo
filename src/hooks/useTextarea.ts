import { useState, useEffect, useRef } from "react";

const minHeight = 200;

const useTextarea = (value: string, height = minHeight) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [content, setContent] = useState(value);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.max(
        textareaRef.current.scrollHeight,
        minHeight,
      )}px`;
    }
  }, [content]);

  return { content, setContent, textareaRef };
};

export default useTextarea;
