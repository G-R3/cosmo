import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "src/pages/api/auth/[...nextauth]";

export async function createContext(ctx?: trpcNext.CreateNextContextOptions) {
  if (ctx?.req && ctx?.res) {
    const session = await unstable_getServerSession(
      ctx.req,
      ctx.res,
      authOptions,
    );
    return {
      req: ctx?.req,
      res: ctx?.res,
      session,
    };
  }

  return {
    req: ctx?.req,
    res: ctx?.res,
  };
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
