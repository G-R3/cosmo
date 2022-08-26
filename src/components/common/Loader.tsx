import React from "react";

const Loader = () => {
  return (
    <span className="flex justify-center items-center absolute top-0 left-0 w-full h-full">
      <span className="h-auto w-7 flex justify-center relative">
        <svg
          className="fill-current"
          viewBox="0 0 120 30"
          xmlns="http://www.w3.org/2000/svg"
          fill="#fff"
        >
          <circle cx="15" cy="15" r="14">
            <animate
              attributeName="opacity"
              dur="1s"
              values="0;1;0"
              repeatCount="indefinite"
              begin="0.1"
            />
          </circle>
          <circle cx="60" cy="15" r="14">
            <animate
              attributeName="opacity"
              dur="1s"
              values="0;1;0"
              repeatCount="indefinite"
              begin="0.2"
            />
          </circle>
          <circle cx="105" cy="15" r="14">
            <animate
              attributeName="opacity"
              dur="1s"
              values="0;1;0"
              repeatCount="indefinite"
              begin="0.4"
            />
          </circle>
        </svg>
      </span>
    </span>
  );
};

export default Loader;
