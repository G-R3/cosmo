import { createRouter } from "../createRouter";
import { z } from "zod";
import { prisma } from "../../db/client";
import { TRPCError } from "@trpc/server";

const regex = new RegExp("^\\w+$");

export const communityRouter = createRouter()
  .query("get", {
    input: z.object({
      query: z.string().trim().min(1).max(25),
    }),
    async resolve({ input, ctx }) {
      const community = await prisma.community.findUnique({
        where: {
          name: input.query,
        },
      });

      if (!community) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Community could not be found",
        });
      }

      return community;
    },
  })
  .query("search", {
    input: z.object({
      query: z.string().trim(),
    }),
    async resolve({ input }) {
      if (!input.query) return;

      const communities = await prisma.community.findMany({
        where: {
          name: {
            contains: input.query,
          },
        },
      });

      return communities;
    },
  })
  .mutation("create", {
    input: z.object({
      name: z
        .string({ required_error: "Community name is required." })
        .trim()
        .min(3, { message: "Name must be at least 3 characters long." })
        .regex(regex, {
          message:
            "Community name most only contain letters, numbers, or underscores.",
        })
        .max(25, { message: "Name must be less than 25 characters long." }),
      description: z.string().trim().optional(),
    }),
    async resolve({ input, ctx }) {
      if (!ctx.session?.user) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not authorized",
        });
      }

      const communityExist = await prisma.community.findUnique({
        where: {
          name: input.name,
        },
      });

      if (communityExist) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Sorry ${input.name} has already been taken. Try something else.`,
        });
      }

      const community = await prisma.community.create({
        data: {
          name: input.name,
          description: input.description,
          creatorId: ctx.session.user.id!,
        },
      });

      return community;
    },
  });
