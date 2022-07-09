import { createRouter } from "../createRouter";
import { commentRouter } from "./comment";
import { communityRouter } from "./community";
import { postRouter } from "./post";

export const appRouter = createRouter()
  .merge("post.", postRouter)
  .merge("comment.", commentRouter)
  .merge("community.", communityRouter);

export type AppRouter = typeof appRouter;
