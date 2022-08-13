import { signIn, useSession } from "next-auth/react";
import React, { ReactNode, useEffect } from "react";

// Most of this stuff (including the custome _app was taken from here)
// https://github.com/nextauthjs/next-auth/issues/1210
// Read through the thread its actuall pretty good

// also checkout this write up. It summarizes this stuff pretty welll
// https://simplernerd.com/next-auth-global-session

// export interface AuthEnabledComponentConfig {
//   auth: {
//     loader: ReactNode;
//   };
// }
export interface PageAuth {
  auth: boolean;
}

export type NextPageWithAuth<PropsType = any> = React.FC<PropsType> & PageAuth;

interface Props {
  children: ReactNode;
}

const Auth: React.FC<Props> = ({ children }) => {
  const { data: session, status } = useSession();
  const isUser = !!session?.user;
  const isLoading = status === "loading";

  useEffect(() => {
    if (isLoading) return;

    if (!isUser) signIn();
  }, [isUser, isLoading]);

  if (isUser) return <>{children}</>;

  return null;
};

export default Auth;
