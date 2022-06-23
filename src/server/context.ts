import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { getSession } from "next-auth/react";

export async function createContext({
  req,
  res,
}: trpcNext.CreateNextContextOptions) {
  const session = await getSession({ req });

  return {
    req,
    res,
    session,
  };
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
