import { ReactNode } from "react";
import Header from "./Header";

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <>
      <Header />
      <main className="h-screen px-5 pt-16 mx-auto lg:max-w-7xl">
        {children}
      </main>
    </>
  );
};

export default Layout;
