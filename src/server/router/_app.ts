import { createRouter } from "../createRouter";
import { commentRouter } from "./comment";
import { postRouter } from "./post";
import { voteRouter } from "./vote";

export const appRouter = createRouter()
  .merge("post.", postRouter)
  .merge("comment.", commentRouter)
  .merge("vote.", voteRouter);

export type AppRouter = typeof appRouter;
