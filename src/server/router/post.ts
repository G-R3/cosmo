import { createRouter } from "../createRouter";
import { z } from "zod";
import { prisma } from "../../db/client";
import { TRPCError } from "@trpc/server";

const slugify = (...args: (string | number)[]): string => {
  const value = args.join(" ");

  return value
    .normalize("NFD") // split an accented letter in the base letter and the acent
    .replace(/[\u0300-\u036f]/g, "") // remove all previously split accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 ]/g, "") // remove all chars not letters, numbers and spaces (to be replaced)
    .replace(/\s+/g, "-"); // separator
};

const basePost = {
  id: true,
  title: true,
  content: true,
  createdAt: true,
  updatedAt: true,
  user: {
    select: {
      id: true,
      name: true,
      image: true,
    },
  },
  community: {
    select: {
      id: true,
      name: true,
    },
  },
  comments: {
    select: {
      id: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  },
  likes: true,
};

export const postRouter = createRouter()
  .query("get-by-id", {
    input: z.object({
      slug: z.string(),
      id: z.number(),
    }),
    async resolve({ input, ctx }) {
      const post = await prisma.post.findUnique({
        where: {
          id: input.id,
        },
        select: {
          ...basePost,
        },
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post does not exist.",
        });
      }

      return {
        ...post,
      };
    },
  })
  .query("get-by-community", {
    input: z.object({
      communityId: z.number().nullish(),
    }),
    async resolve({ input, ctx }) {
      if (!input.communityId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post does not exist.",
        });
      }

      const posts = await prisma.post.findMany({
        where: {
          community: {
            id: input.communityId,
          },
        },
        select: {
          ...basePost,
          slug: true,
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
        })),
      ];
    },
  })
  .query("feed", {
    async resolve({ input, ctx }) {
      const posts = await prisma.post.findMany({
        select: {
          ...basePost,
          slug: true,
          comments: false,
          _count: {
            select: {
              comments: true,
            },
          },
        },
      });

      return [
        ...posts.map((post) => ({
          ...post,
          commentCount: post._count.comments,
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
  })
  .mutation("like", {
    input: z.object({
      postId: z.number(),
    }),
    async resolve({ input, ctx }) {
      if (!ctx.session?.user) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not authorized",
        });
      }

      const newLike = await prisma.like.create({
        data: {
          post: {
            connect: {
              id: input.postId,
            },
          },
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });

      return newLike;
    },
  })
  .mutation("unlike", {
    input: z.object({
      postId: z.number(),
    }),
    async resolve({ input, ctx }) {
      if (!ctx.session?.user) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not authorized",
        });
      }

      const deletedLike = await prisma.like.delete({
        where: {
          likeId: {
            userId: ctx.session.user.id,
            postId: input.postId,
          },
        },
      });

      return deletedLike;
    },
  });
