import { ReactNode } from "react";
import Header from "./Header";

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <>
      <Header />
      <main className=" py-16 lg:py-20">{children}</main>
    </>
  );
};

export default Layout;
