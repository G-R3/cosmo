import { createRouter } from "../createRouter";
import { z } from "zod";
import { prisma } from "../../db/client";
import { TRPCError } from "@trpc/server";

export const userRouter = createRouter().query("has-voted", {
  input: z.object({
    userEmail: z.string().email(),
    postId: z.number().int(),
  }),

  async resolve({ input }) {
    const userVotes = await prisma.user.findUnique({
      where: {
        email: input.userEmail,
      },
      select: {
        Votes: true,
      },
    });

    const vote = userVotes?.Votes.find(
      (vote) =>
        vote.postId === input.postId && vote.userEmail === input.userEmail,
    );

    return {
      hasVoted: !!vote,
      voteType: vote?.voteType,
    };
  },
});
