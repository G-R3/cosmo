import "../styles/globals.css";
import { withTRPC } from "@trpc/next";
import { AppProps } from "next/app";
import { AppRouter } from "../server/router/_app";
import { SessionProvider } from "next-auth/react";
import Layout from "../components/Layout";

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
  return (
    <SessionProvider session={session}>
      <Layout>
        <Component {...pageProps} />
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
