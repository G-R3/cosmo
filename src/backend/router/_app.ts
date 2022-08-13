import superjson from "superjson";
import { createRouter } from "../createRouter";
import { commentRouter } from "./comment";
import { communityRouter } from "./community";
import { postRouter } from "./post";
import { userRouter } from "./user";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("post.", postRouter)
  .merge("comment.", commentRouter)
  .merge("community.", communityRouter)
  .merge("user.", userRouter);

export type AppRouter = typeof appRouter;
