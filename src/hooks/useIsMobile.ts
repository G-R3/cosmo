import { useEffect, useState } from "react";

const MOBILE_WIDTH = 768;

const useIsMobile = () => {
  const handleResize = () => {
    if (typeof window === "undefined") return false;

    return window.innerWidth <= MOBILE_WIDTH;
  };
  const [isMobile, setIsMobile] = useState(handleResize);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setIsMobile(handleResize);
    });

    return () => {
      window.removeEventListener("resize", () => {
        setIsMobile(handleResize);
      });
    };
  }, []);

  return isMobile;
};

export default useIsMobile;
