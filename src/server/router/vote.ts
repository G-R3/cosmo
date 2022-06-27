import { createRouter } from "../createRouter";
import { z } from "zod";
import { prisma } from "../../db/client";
import { TRPCError } from "@trpc/server";

export const voteRouter = createRouter()
  .query("get", {
    input: z.object({
      postId: z.number().int(),
    }),

    async resolve({ input }) {
      const voteCount = prisma.post.findUnique({
        where: {
          id: input.postId,
        },
        select: {
          voteCount: true,
        },
      });

      return voteCount;
    },
  })
  .mutation("create", {
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
      let { postId, voteType } = input;

      // check if user & postId combo exists
      const hasVoted = await prisma.votes.findUnique({
        where: {
          voteId: {
            postId: postId,
            userEmail: ctx.session.user.email!,
          },
        },
      });

      console.log(hasVoted?.voteType, voteType);

      if (hasVoted) {
        if (hasVoted.voteType === 1 && voteType === -1) {
          console.log("clicked downvote when prev upvoted");
          await prisma.votes.update({
            where: {
              voteId: {
                postId: postId,
                userEmail: ctx.session.user.email!,
              },
            },
            data: {
              voteType: voteType,
            },
          });

          voteType = voteType * 2;
        } else if (hasVoted.voteType === -1 && voteType === 1) {
          console.log("clicked upvote when prev downvoted");
          await prisma.votes.update({
            where: {
              voteId: {
                postId: postId,
                userEmail: ctx.session.user.email!,
              },
            },
            data: {
              voteType: voteType,
            },
          });

          voteType = voteType * 2;
        } else if (hasVoted.voteType === voteType) {
          console.log("undo vote");
          await prisma.votes.update({
            where: {
              voteId: {
                postId: postId,
                userEmail: ctx.session.user.email!,
              },
            },
            data: {
              voteType: 0,
            },
          });

          voteType = voteType * -1;
        } else {
          await prisma.votes.update({
            where: {
              voteId: {
                postId: postId,
                userEmail: ctx.session.user.email!,
              },
            },
            data: {
              voteType: voteType,
            },
          });
        }
      } else {
        // create the vote
        await prisma.votes.create({
          data: {
            voteType: voteType,
            postId: postId,
            userEmail: ctx.session.user.email!,
          },
        });
      }

      // update the post vote total count
      const post = await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          voteCount: {
            increment: voteType,
          },
        },
      });

      return {
        success: true,
        data: post.voteCount,
      };
    },
  });
