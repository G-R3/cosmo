import { createRouter } from "../createRouter";
import { postRouter } from "./post";

export const appRouter = createRouter()
  .query("test", {
    resolve() {
      return {
        testing: "testing",
      };
    },
  })
  .merge("post.", postRouter);

export type AppRouter = typeof appRouter;
