import "../styles/globals.css";
import { withTRPC } from "@trpc/next";
import { AppProps } from "next/app";
import { AppRouter } from "../server/router/_app";
import { SessionProvider } from "next-auth/react";
import Layout from "../components/Layout";
import Auth, { AuthEnabledComponentConfig } from "../components/Auth";
import { NextComponentType, NextPageContext } from "next";

type AppAuthProps = AppProps & {
  Component: NextComponentType<NextPageContext, any, {}> &
    Partial<AuthEnabledComponentConfig>;
};

const App = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppAuthProps) => {
  return (
    <SessionProvider session={session}>
      <Layout>
        {Component.auth ? (
          <Auth loader={Component.auth.loader}>
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
  ssr: false,
})(App);
