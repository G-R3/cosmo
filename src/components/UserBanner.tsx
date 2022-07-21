import { FC, useState } from "react";
import Image from "next/image";
import { BsGear } from "react-icons/bs";
import { Popover } from "@headlessui/react";

type Props = {
  imageSrc: string;
  displayName: string;
};

// red, orange, yellow, green, teal, cyan, blue, violet, purple, pink
const colorArray = [
  {
    name: "red",
    value: "ef4444",
  },

  {
    name: "orange",
    value: "f97316",
  },
  {
    name: "yellow",
    value: "eab308",
  },
  {
    name: "green",
    value: "22c55e",
  },
  {
    name: "teal",
    value: "14b8a6",
  },
  {
    name: "cyan",
    value: "06b6d4",
  },
  {
    name: "blue",
    value: "3b82f6",
  },
  {
    name: "violet",
    value: "8b5cf6",
  },
  {
    name: "purple",
    value: "a855f7",
  },
  {
    name: "pink",
    value: "ec4899",
  },
];

const BannerBackground = () => {
  const [color, setColor] = useState(() => {
    const color = localStorage.getItem("bannerColor");
    try {
      return color ? `${JSON.parse(color)}` : "ef4444";
    } catch (e) {
      console.error("Error loading banner color from localstorage");
      return "ef4444";
    }
  });

  const changeBannerColor = (color: string) => {
    setColor(color);
    localStorage.setItem("bannerColor", JSON.stringify(color));
  };

  console.log(color);

  return (
    <>
      <div
        className={`h-44 w-full absolute top-0 left-0 rounded-md flex justify-end items-start`}
        style={{
          backgroundColor: `#${color}`,
        }}
      >
        <Popover className="relative">
          <Popover.Button className="p-2 group">
            <span className="sr-only">Menu</span>
            <BsGear
              size={20}
              className="group-hover:rotate-180 transition-transform duration-700"
            />
          </Popover.Button>

          <Popover.Panel className="absolute right-0 z-10 w-screen max-w-[250px]">
            <div className="bg-darkOne grid grid-cols-3 p-2 rounded-md w-full">
              {colorArray.map((color) => (
                <button
                  key={color.value}
                  onClick={() => changeBannerColor(color.value)}
                  className="text-sm flex flex-col gap-1 items-center rounded-md hover:cursor-pointer hover:bg-darkTwo py-2 px-5"
                >
                  <div
                    style={{ backgroundColor: `#${color.value}` }}
                    className="w-7 h-7 rounded-md"
                  ></div>
                  {color.name}
                </button>
              ))}
            </div>
          </Popover.Panel>
        </Popover>
      </div>
    </>
  );
};

const UserBanner: FC<Props> = ({ imageSrc, displayName }) => {
  return (
    <div className="relative py-5">
      <BannerBackground />
      <div className="relative top-24 flex items-center gap-4 px-5">
        <Image
          src={imageSrc}
          alt={`${displayName}'s Avatar`}
          width={150}
          height={150}
          className="rounded-full"
          priority
        />
        <h1 className="text-2xl font-semibold mt-6">{displayName}</h1>
      </div>
    </div>
  );
};

export default UserBanner;
