import { createRouter } from "../createRouter";
import { z, ZodError } from "zod";
import { prisma } from "../clients/client";
import { TRPCError } from "@trpc/server";

export const commentRouter = createRouter()
  .query("get-by-postId", {
    input: z.object({
      postId: z.string(),
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
              role: true,
            },
          },
        },
      });

      return {
        comments: postComments,
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
        session: {
          ...ctx.session,
          user: {
            ...ctx.session.user,
          },
        },
      },
    });
  })
  .mutation("create", {
    input: z.object({
      postId: z.string(),
      content: z
        .string()
        .trim()
        .min(1, { message: "Comment can't be empty" })
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

      await prisma.comment.create({
        data: {
          content: input.content,
          authorId: ctx.session.user.id,
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
      commentId: z.string(),
      content: z
        .string()
        .trim()
        .min(1, { message: "Comment can't be empty" })
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

      const comment = await prisma.comment.findUnique({
        where: {
          id: input.commentId,
        },
        select: {
          authorId: true,
        },
      });

      if (!comment || comment.authorId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not authorized",
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
      commentId: z.string(),
    }),
    async resolve({ input, ctx }) {
      const comment = await prisma.comment.findUnique({
        where: {
          id: input.commentId,
        },
        select: {
          authorId: true,
          post: {
            select: {
              community: {
                select: {
                  moderators: true,
                },
              },
            },
          },
        },
      });

      if (!comment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Comment not found",
        });
      }

      const isModerator = comment.post.community.moderators.some(
        (mod) => mod.userId === ctx.session.user.id,
      );
      const isAdmin = ctx.session.user.role === "ADMIN";

      if (
        comment.authorId !== ctx.session.user.id &&
        !isModerator &&
        !isAdmin
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not authorized",
        });
      }

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
