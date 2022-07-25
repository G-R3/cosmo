import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { getSession } from "next-auth/react";

export async function createContext(opts?: trpcNext.CreateNextContextOptions) {
  const session = await getSession({ req: opts?.req });

  return {
    req: opts?.req,
    res: opts?.res,
    session,
  };
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
