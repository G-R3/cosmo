import Link from "next/link";
import Navbar from "./Navbar";

const Header: React.FC = () => {
  return (
    <>
      <header
        className={`backdrop-saturate-50 backdrop-blur-sm fixed top-0 left-0 w-full z-10 transition-all duration-200 ease-in`}
      >
        <div className="relative px-5 h-14 lg:h-16 ">
          <div className="flex">
            <div className="flex-shrink-0">
              <Link href={"/"}>
                <a className="flex items-center h-14 lg:h-16 w-full text-3xl text-primary dark:text-whiteAlt">
                  Cosmo
                </a>
              </Link>
            </div>
            <div className="flex gap-5 justify-end items-center flex-grow">
              <Navbar />
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
