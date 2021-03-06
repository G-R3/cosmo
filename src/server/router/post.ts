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

export const basePost = {
  id: true,
  title: true,
  content: true,
  createdAt: true,
  updatedAt: true,
  author: {
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
  likes: {
    select: {
      postId: true,
      userId: true,
    },
  },
};

/**
 * get-by-id
 * get-by-community
 * feed
 * create
 * edit
 * like
 * unlike
 *
 */
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
          slug: true,
          _count: {
            select: {
              comments: true,
            },
          },
        },
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post does not exist.",
        });
      }

      return {
        post: {
          ...post,
          commentCount: post._count.comments,
        },
      };
    },
  })
  .query("get-by-community", {
    input: z.object({
      query: z.string().trim().min(1).max(25),
    }),
    async resolve({ input, ctx }) {
      const posts = await prisma.post.findMany({
        where: {
          community: {
            name: input.query,
          },
        },
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

      return {
        posts: [
          ...posts.map((post) => ({
            ...post,
            commentCount: post._count.comments,
          })),
        ],
      };
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

      return {
        posts: [
          ...posts.map((post) => ({
            ...post,
            commentCount: post._count.comments,
          })),
        ],
      };
    },
  })
  .mutation("create", {
    input: z.object({
      title: z.string().trim().min(1).max(300),
      content: z.string().trim().max(500).optional(),
      communityId: z.number(),
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
          id: input.communityId,
        },
      });

      if (!communityExists) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Community does not exist.",
        });
      }

      const post = await prisma.post.create({
        data: {
          title: input.title,
          content: input.content,
          slug: slugify(input.title),
          authorId: ctx.session.user.id!,
          communityId: input.communityId,
        },
        select: {
          id: true,
          slug: true,
          community: {
            select: {
              name: true,
            },
          },
        },
      });

      return {
        success: true,
        message: "Post created successfully",
        post,
      };
    },
  })
  .mutation("edit", {
    input: z.object({
      postId: z.number(),
      content: z.string().trim().max(500).optional(),
    }),
    async resolve({ input, ctx }) {
      if (!ctx.session?.user) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not authorized",
        });
      }

      const editedPost = await prisma.post.update({
        where: {
          id: input.postId,
        },
        data: {
          content: input.content,
        },
      });

      return {
        post: editedPost,
      };
    },
  })
  .mutation("delete", {
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

      const deletedPost = await prisma.post.delete({
        where: {
          id: input.postId,
        },
        select: {
          community: {
            select: {
              name: true,
            },
          },
        },
      });

      return {
        post: deletedPost,
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
