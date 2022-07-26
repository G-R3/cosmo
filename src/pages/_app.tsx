import "../styles/globals.css";
import { withTRPC } from "@trpc/next";
import { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { NextComponentType, NextPageContext } from "next";
import { ThemeProvider } from "next-themes";
import { AppRouter } from "../server/router/_app";
import Layout from "../components/Layout";
import Auth, { PageAuth } from "../components/Auth";

type AppAuthProps = AppProps & {
  Component: NextComponentType<NextPageContext, any, {}> & Partial<PageAuth>;
};

const App = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppAuthProps) => {
  return (
    <SessionProvider session={session}>
      <ThemeProvider
        storageKey="theme"
        defaultTheme="dark"
        enableSystem={true}
        themes={["light", "dark"]}
        attribute="class"
      >
        <Layout>
          {Component.auth ? (
            <Auth>
              <Component {...pageProps} />
            </Auth>
          ) : (
            <Component {...pageProps} />
          )}
        </Layout>
      </ThemeProvider>
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
