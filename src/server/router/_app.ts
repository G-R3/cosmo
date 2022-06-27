import { createRouter } from "../createRouter";
import { commentRouter } from "./comment";
import { postRouter } from "./post";
import { userRouter } from "./user";
import { voteRouter } from "./vote";

export const appRouter = createRouter()
  .merge("post.", postRouter)
  .merge("comment.", commentRouter)
  .merge("vote.", voteRouter)
  .merge("user.", userRouter);

export type AppRouter = typeof appRouter;
