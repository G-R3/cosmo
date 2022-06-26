import { createRouter } from "../createRouter";
import { z } from "zod";
import { prisma } from "../../db/client";
import { TRPCError } from "@trpc/server";

export const commentRouter = createRouter().mutation("create", {
  input: z.object({
    content: z.string().trim().min(1),
    postId: z.number(),
  }),
  async resolve({ input, ctx }) {
    if (!ctx.session?.user) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You are not authorized",
      });
    }

    await prisma.comment.create({
      data: {
        content: input.content,
        userEmail: ctx.session.user.email!,
        postId: input.postId,
      },
    });

    return {
      success: true,
      message: "Comment created",
    };
  },
});
