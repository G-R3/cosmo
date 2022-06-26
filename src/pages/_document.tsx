import { Html, Head, Main, NextScript } from "next/document";

const Document = () => {
  return (
    <Html className="dark">
      <Head />
      <body className="bg-foreground text-darkOne dark:bg-background dark:text-whiteAlt">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
