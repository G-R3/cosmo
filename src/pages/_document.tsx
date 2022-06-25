import { Html, Head, Main, NextScript } from "next/document";

const Document = () => {
  return (
    <Html className="dark">
      <Head />
      <body className="bg-foreground text-background dark:bg-background dark:text-foreground">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
