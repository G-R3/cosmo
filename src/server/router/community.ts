import { createRouter } from "../createRouter";
import { z } from "zod";
import { prisma } from "../../db/client";
import { TRPCError } from "@trpc/server";

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
      name: z.string().trim().min(1).max(25),
      description: z.string().nullable(),
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
          message: "Community already exists",
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
