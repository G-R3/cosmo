import "../styles/globals.css";
import { withTRPC } from "@trpc/next";
import { AppType } from "next/dist/shared/lib/utils";
import { AppRouter } from "../server/router/_app";
import { SessionProvider } from "next-auth/react";
import Layout from "../components/Layout";
import { NextPage } from "next";
import Auth from "../components/Auth";

export type NextPageWithAuth = NextPage & {
  auth?: boolean;
};

const MyApp: AppType = ({
  Component,
  pageProps: { session, ...pageProps },
}: {
  Component: NextPageWithAuth;
  pageProps: any;
}) => {
  return (
    <SessionProvider session={session}>
      <Layout>
        {Component.auth ? (
          <Auth>
            <Component {...pageProps} />
          </Auth>
        ) : (
          <Component {...pageProps} />
        )}
      </Layout>
    </SessionProvider>
  );
};

export default withTRPC<AppRouter>({
  config({ ctx }) {
    const url = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/trpc`
      : "http://localhost:3000/api/trpc";

    return {
      url,
    };
  },
  ssr: true,
})(MyApp);
