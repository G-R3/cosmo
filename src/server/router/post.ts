import { createRouter } from "../createRouter";
import { z } from "zod";
import { prisma } from "../../db/client";
import { TRPCError } from "@trpc/server";

export const slugify = (...args: (string | number)[]): string => {
  const value = args.join(" ");

  return value
    .normalize("NFD") // split an accented letter in the base letter and the acent
    .replace(/[\u0300-\u036f]/g, "") // remove all previously split accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 ]/g, "") // remove all chars not letters, numbers and spaces (to be replaced)
    .replace(/\s+/g, "-"); // separator
};

export const postRouter = createRouter()
  .query("get", {
    input: z.object({
      slug: z.string(),
    }),
    async resolve({ input, ctx }) {
      const post = await prisma.post.findUnique({
        where: {
          slug: input.slug,
        },
        include: {
          user: true,
          comments: {
            include: {
              user: true,
            },
          },
          votes: true,
          community: true,
        },
      });

      if (!post) {
        return null;
      }

      return {
        ...post,
        hasVoted: post.votes.find(
          (vote) => vote.userId === ctx.session?.user?.id,
        ),
        totalVotes: post.votes.reduce((prev, curr) => {
          return prev + curr.voteType;
        }, 0),
      };
    },
  })
  .query("all", {
    async resolve({ input, ctx }) {
      const posts = await prisma.post.findMany({
        include: {
          user: true,
          votes: true,
          community: true,
          _count: {
            select: {
              comments: true,
            },
          },
        },
      });

      return [
        ...posts.map((post) => ({
          id: post.id,
          title: post.title,
          content: post.content,
          slug: post.slug,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          commentCount: post._count.comments,
          community: post.community,
          user: {
            id: post.user.id,
            name: post.user.name,
            image: post.user.image,
          },
          hasVoted: post.votes.find(
            (vote) => vote.userId === ctx.session?.user?.id,
          ),
          totalVotes: post.votes.reduce((prev, curr) => {
            return prev + curr.voteType;
          }, 0),
        })),
      ];
    },
  })
  .mutation("create", {
    input: z.object({
      title: z.string().trim().min(1).max(300),
      content: z.string().trim(),
      community: z.string().trim().min(1),
    }),
    async resolve({ input, ctx }) {
      if (!ctx.session?.user) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not authorized",
        });
      }

      const communityExists = await prisma.community.findUnique({
        where: {
          name: input.community,
        },
      });

      if (!communityExists) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Community does not exist.",
        });
      }

      await prisma.post.create({
        data: {
          title: input.title,
          content: input.content,
          slug: slugify(input.title),
          userId: ctx.session.user.id!,
          communityName: input.community,
        },
      });

      return {
        success: true,
        message: "Post created successfully",
      };
    },
  });
