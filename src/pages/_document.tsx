import { Html, Head, Main, NextScript } from "next/document";

const Document = () => {
  return (
    <Html className="">
      <Head />
      <body className="bg-foreground text-darkOne dark:bg-background dark:text-grayAlt">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
