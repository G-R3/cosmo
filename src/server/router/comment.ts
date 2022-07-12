import { createRouter } from "../createRouter";
import { z } from "zod";
import { prisma } from "../../db/client";
import { TRPCError } from "@trpc/server";

export const commentRouter = createRouter()
  .query("get-by-postId", {
    input: z.object({
      postId: z.number(),
    }),
    async resolve({ input }) {
      const postComments = await prisma.comment.findMany({
        where: {
          postId: input.postId,
        },
        select: {
          id: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      return {
        comments: postComments,
        total: postComments.length,
      };
    },
  })
  .mutation("create", {
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
          authorId: ctx.session.user.id!,
          postId: input.postId,
        },
      });

      return {
        success: true,
        message: "Comment created",
      };
    },
  });
