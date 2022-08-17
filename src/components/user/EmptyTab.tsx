import Image from "next/image";
import spaceThree from "../../assets/space-3.svg";

const EmptyMessage = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <Image src={spaceThree} alt="Space Illustration" />
      <div className="flex flex-col justify-center items-center max-w-lg mx-auto -mt-3">
        <h1 className="text-highlight font-bold text-3xl text-center">Woah!</h1>
        <p className="text-lg text-grayAlt">Its sure is empty here</p>
      </div>
    </div>
  );
};

export default EmptyMessage;
