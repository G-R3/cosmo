import { createRouter } from "../createRouter";
import { postRouter } from "./post";

export const appRouter = createRouter().merge("post.", postRouter);

export type AppRouter = typeof appRouter;
