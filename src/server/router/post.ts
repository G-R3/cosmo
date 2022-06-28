import { createRouter } from "../createRouter";
import { z } from "zod";
import { prisma } from "../../db/client";
import { TRPCError } from "@trpc/server";

export const postRouter = createRouter()
  .query("get", {
    input: z.object({
      slug: z.string(),
    }),
    async resolve({ input, ctx }) {
      const post = await prisma.post.findFirst({
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
        },
      });

      if (!post) {
        return null;
      }

      return {
        ...post,
        hasVoted: post.votes.find(
          (vote) => vote.userEmail === ctx.session?.user?.email,
        ),
        totalVotes: post.votes.reduce((prev, curr) => {
          return prev + curr.voteType;
        }, 0),
      };
    },
  })
  .query("all", {
    async resolve() {
      const posts = await prisma.post.findMany({
        include: {
          user: true,
          _count: {
            select: {
              comments: true,
            },
          },
        },
      });

      // doing this so that I can exclude the userEmail field idk why I'm doing. I guess because I don't like it being there? maybe I'm doing the relation wrong. Like maybe I should have an int id for the user. no way right? i think i'm doing it right. right? https://www.prisma.io/docs/guides/database/troubleshooting-orm/help-articles/working-with-many-to-many-relations#explicit-relations

      // but I can also do it like this: https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#select-specific-relation-fields
      return [
        ...posts.map((post) => ({
          id: post.id,
          title: post.title,
          content: post.content,
          slug: post.slug,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          commentCount: post._count.comments,
          user: {
            id: post.user.id,
            name: post.user.name,
            image: post.user.image,
          },
        })),
      ];
    },
  })
  .mutation("create", {
    input: z.object({
      title: z.string().trim().min(1).max(300),
      content: z.string().trim(),
    }),
    async resolve({ input, ctx }) {
      if (!ctx.session?.user) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not authorized",
        });
      }

      await prisma.post.create({
        data: {
          title: input.title,
          content: input.content,
          slug: input.title.toLowerCase().replace(/\s/g, "-"),
          userEmail: ctx.session.user.email!,
        },
      });

      return {
        success: true,
        message: "Post created successfully",
      };
    },
  });
