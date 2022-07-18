import { Context } from "./context";
import * as trpc from "@trpc/server";
import { ZodError } from "zod";

export function createRouter() {
  return trpc.router<Context>().formatError(({ shape, error }) => {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === "BAD_REQUEST" && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
      },
    };
  });
}
