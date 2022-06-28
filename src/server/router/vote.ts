import { createRouter } from "../createRouter";
import { z } from "zod";
import { prisma } from "../../db/client";
import { TRPCError } from "@trpc/server";

export const voteRouter = createRouter().mutation("create", {
  input: z.object({
    voteType: z.number().int().min(-1).max(1),
    postId: z.number().int(),
  }),
  async resolve({ input, ctx }) {
    if (!ctx.session?.user) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You are not authorized",
      });
    }
    const { postId, voteType } = input;

    const hasVoted = await prisma.votes.findUnique({
      where: {
        voteId: {
          userId: ctx.session.user.id!,
          postId,
        },
      },
    });

    // if user has voted
    // if new vote is the not the same as the saved vote ---> update the saved vote
    // if the vote is the same as the saved vote ----> delete the record

    if (hasVoted) {
      if (hasVoted.voteType !== voteType) {
        const updatedVote = await prisma.votes.update({
          where: {
            voteId: {
              postId,
              userId: ctx.session.user.id!,
            },
          },
          data: {
            voteType,
          },
        });

        return updatedVote;
      }

      const deletedVote = await prisma.votes.delete({
        where: {
          voteId: {
            postId,
            userId: ctx.session.user.id!,
          },
        },
      });

      return deletedVote;
    }

    // otherwise, create a new vote and connect relationships
    const newVote = await prisma.votes.create({
      data: {
        voteType,
        postId,
        userId: ctx.session.user.id!,
      },
    });

    return newVote;
  },
});
