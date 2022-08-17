import Image from "next/image";
import { FC } from "react";
import spaceOne from "../../assets/space-1.svg";

const NotFound: FC<{
  heading?: string;
  text?: string;
}> = ({ heading, text }) => {
  return (
    <div className="flex flex-col justify-center items-center gap-10">
      <Image src={spaceOne} alt="Space Illustration" />
      <div className="flex flex-col justify-center items-center max-w-lg mx-auto">
        <h1 className="text-highlight font-bold text-3xl text-center">
          {heading}
        </h1>
        <p className="text-lg text-grayAlt text-center">{text}</p>
      </div>
    </div>
  );
};

export default NotFound;
