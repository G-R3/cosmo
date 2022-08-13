import { FC } from "react";
import Head from "next/head";

const CustomHead: FC<{ title?: string; description?: string }> = ({
  title,
  description,
}) => {
  return (
    <Head>
      <title>{title || "Cosmo"}</title>
      <meta
        name="description"
        content={description || "A place to create communities and discuss"}
      />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

export default CustomHead;
