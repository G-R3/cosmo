import { createRouter } from "../createRouter";
import { z } from "zod";
import { prisma } from "../../db/client";
import { TRPCError } from "@trpc/server";

export const communityRouter = createRouter()
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
      name: z.string().trim().min(1),
      description: z.string().nullable(),
    }),
    async resolve({ input }) {
      const community = await prisma.community.create({
        data: {
          name: input.name,
          description: input.description,
        },
      });

      return community;
    },
  });
