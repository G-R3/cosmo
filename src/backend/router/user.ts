import { createRouter } from "../createRouter";
import { z } from "zod";
import { prisma } from "../clients/client";
import { basePost } from "./post";

export const userRouter = createRouter()
  .query("get-by-id", {
    input: z.object({
      userId: z.string(),
    }),
    async resolve({ input, ctx }) {
      const user = await prisma.user.findUnique({
        where: {
          id: input.userId,
        },
        select: {
          id: true,
          name: true,
          image: true,
          role: true,
        },
      });

      return {
        user,
      };
    },
  })
  .query("get-posts", {
    input: z.object({
      user: z.string(),
    }),

    async resolve({ input }) {
      const posts = await prisma.post.findMany({
        where: {
          authorId: input.user,
        },
        select: {
          ...basePost,
          slug: true,
          savedBy: {
            select: {
              postId: true,
              userId: true,
            },
          },
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
  .query("get-liked-posts", {
    input: z.object({
      user: z.string(),
    }),
    async resolve({ input }) {
      const posts = await prisma.post.findMany({
        where: {
          likes: {
            some: {
              userId: input.user,
            },
          },
        },
        select: {
          ...basePost,
          slug: true,
          savedBy: {
            select: {
              postId: true,
              userId: true,
            },
          },
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
  .query("get-saved-posts", {
    input: z.object({
      user: z.string(),
    }),
    async resolve({ input }) {
      const posts = await prisma.post.findMany({
        where: {
          savedBy: {
            some: {
              userId: input.user,
            },
          },
        },
        select: {
          ...basePost,
          slug: true,
          savedBy: {
            select: {
              postId: true,
              userId: true,
            },
          },
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
  .query("get-comments", {
    input: z.object({
      user: z.string(),
    }),
    async resolve({ input }) {
      const comments = await prisma.comment.findMany({
        where: {
          authorId: input.user,
        },
        select: {
          id: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          author: {
            select: {
              id: true,
              name: true,
              image: true,
              role: true,
            },
          },
          post: {
            select: {
              community: {
                select: {
                  moderators: true,
                },
              },
            },
          },
        },
      });

      return {
        comments,
      };
    },
  })
  .query("search", {
    input: z.object({
      query: z.string().trim(),
    }),
    async resolve({ input }) {
      const users = await prisma.user.findMany({
        where: {
          name: {
            contains: input.query,
          },
        },
      });

      return {
        users,
      };
    },
  })
  .query("get-communities", {
    input: z.object({
      userId: z.string(),
    }),
    async resolve({ input }) {
      const communities = await prisma.community.findMany({
        where: {
          // return communities where every moderators matches the userId(??)
          moderators: {
            every: {
              userId: input.userId,
            },
          },
        },
        select: {
          id: true,
          name: true,
        },
      });

      return {
        communities,
      };
    },
  });
