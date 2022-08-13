import * as trpcNext from "@trpc/server/adapters/next";
import { createContext } from "../../../backend/context";
import { appRouter } from "../../../backend/router/_app";

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: createContext,
});
