import { createRouter } from "../createRouter";
import { z, ZodError } from "zod";
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
  .middleware(async ({ ctx, next }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You are not authorized",
      });
    }

    return next({
      ctx: {
        ...ctx,
        user: ctx.session.user,
      },
    });
  })
  .mutation("create", {
    input: z.object({
      content: z
        .string()
        .trim()
        .min(1, { message: "Comment must be at least 1 character long" })
        .max(500, { message: "Comment must be less than 500 characters" }),
      postId: z.number(),
    }),
    async resolve({ input, ctx }) {
      // I'm not sure if I'm handling zod erros correctly here. pain...
      if (input.content.length < 1 || input.content.length > 500) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Comment must be between 1 and 500 characters.",
          cause: ZodError,
        });
      }

      await prisma.comment.create({
        data: {
          content: input.content,
          authorId: ctx.user.id,
          postId: input.postId,
        },
      });

      return {
        success: true,
        message: "Comment created",
      };
    },
  })
  .mutation("edit", {
    input: z.object({
      commentId: z.number(),
      content: z
        .string()
        .trim()
        .min(1, { message: "Comment must be at least 1 character long" })
        .max(500, { message: "Comment must be less than 500 characters" }),
    }),
    async resolve({ input, ctx }) {
      // I'm not sure if I'm handling zod erros correctly here. pain...
      if (input.content.length < 1 || input.content.length > 500) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Comment must be between 1 and 500 characters.",
          cause: ZodError,
        });
      }

      const updatedComment = await prisma.comment.update({
        where: {
          id: input.commentId,
        },
        data: {
          content: input.content,
        },
      });

      return {
        comment: updatedComment,
      };
    },
  })
  .mutation("delete", {
    input: z.object({
      commentId: z.number(),
    }),
    async resolve({ input, ctx }) {
      const deletedComment = await prisma.comment.delete({
        where: {
          id: input.commentId,
        },
      });

      return {
        comment: deletedComment,
      };
    },
  });
