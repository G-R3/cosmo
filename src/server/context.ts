import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "src/pages/api/auth/[...nextauth]";

export async function createContext(opts?: trpcNext.CreateNextContextOptions) {
  if (!opts?.req || !opts.res) return null;

  const session = await unstable_getServerSession(
    opts.req,
    opts.res,
    authOptions,
  );

  return {
    req: opts?.req,
    res: opts?.res,
    session,
  };
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
