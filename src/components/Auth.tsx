import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { ReactNode, useEffect } from "react";

// Most of this stuff (including the custome _app was taken from here)
// https://github.com/nextauthjs/next-auth/issues/1210
// Read through the thread its actuall pretty good

// also checkout this write up. It summarizes this stuff pretty welll
// https://simplernerd.com/next-auth-global-session

export interface AuthEnabledComponentConfig {
  auth: {
    loader: ReactNode;
  };
}

export type ComponentWithAuth<PropsType = any> = React.FC<PropsType> &
  AuthEnabledComponentConfig;

interface Props {
  children: ReactNode;
  loader: ReactNode;
}

const Auth: React.FC<Props> = ({ children, loader }) => {
  const { data: session, status } = useSession();
  const isUser = !!session?.user;
  const isLoading = status === "loading";
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isUser) {
      // using the signIn gives us the callbackUrl
      //   router.push("/auth/signin");
      signIn();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUser, isLoading]);

  if (isLoading || !session) {
    return <>{loader}</>;
  }

  return <>{children}</>;
};

export default Auth;
