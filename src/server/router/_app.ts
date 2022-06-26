import { createRouter } from "../createRouter";
import { commentRouter } from "./comment";
import { postRouter } from "./post";

export const appRouter = createRouter()
  .merge("post.", postRouter)
  .merge("comment.", commentRouter);

export type AppRouter = typeof appRouter;
