import { createRouter } from "../createRouter";
import { z } from "zod";
import { prisma } from "../../db/client";

export const postRouter = createRouter()
  .query("get", {
    input: z.object({
      slug: z.string(),
    }),
    async resolve({ input }) {
      const post = await prisma.post.findFirst({
        where: {
          slug: input.slug,
        },
      });

      return post;
    },
  })
  .query("all", {
    async resolve() {
      const posts = await prisma.post.findMany();

      return posts;
    },
  })
  .mutation("create", {
    input: z.object({
      title: z.string().trim().min(1).max(300),
      content: z.string().trim(),
    }),

    async resolve({ input }) {
      await prisma.post.create({
        data: {
          title: input.title,
          content: input.content,
          slug: input.title.toLowerCase().replace(/\s/g, "-"),
        },
      });

      return {
        success: true,
        message: "Post created successfully",
      };
    },
  });
