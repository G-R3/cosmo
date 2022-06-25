import { Html, Head, Main, NextScript } from "next/document";

const Document = () => {
  return (
    <Html className="dark">
      <Head />
      <body className="bg-foreground text-accentOne dark:bg-background dark:text-accentFour">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
