import { createRouter } from "../createRouter";
import { z } from "zod";

export const postRouter = createRouter().query("hello", {
  input: z.object({
    name: z.string(),
  }),

  resolve({ input }) {
    return {
      greeting: `Hello ${input.name}`,
    };
  },
});
