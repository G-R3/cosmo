import { ReactNode } from "react";
import Header from "./Header";

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <>
      <Header />
      <main className="px-5 pt-16 lg:pt-24 mx-auto lg:max-w-7xl">
        {children}
      </main>
    </>
  );
};

export default Layout;
