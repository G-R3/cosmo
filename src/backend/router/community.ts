import { createRouter } from "../createRouter";
import { z } from "zod";
import { prisma } from "../clients/client";
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
        select: {
          id: true,
          name: true,
          title: true,
          description: true,
          createdAt: true,
          moderators: {
            select: {
              createdAt: true,
              user: {
                select: {
                  id: true,
                  image: true,
                  name: true,
                },
              },
            },
          },
          creator: {
            select: {
              id: true,
            },
          },
          tags: {
            select: {
              id: true,
              name: true,
            },
          },
          members: {
            select: {
              id: true,
              userId: true,
            },
          },
        },
      });

      if (!community) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Community could not be found",
        });
      }

      const isMember = community.members.some(
        (member) => member.userId === ctx.session?.user.id,
      );

      const isModerator = community.moderators.some(
        (moderator) => moderator.user.id === ctx.session?.user.id,
      );

      return {
        community,
        isModerator,
        isMember,
        isAdmin: ctx.session?.user.role === "ADMIN",
      };
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
  .middleware(async ({ ctx, next }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You are not authorized",
      });
    }

    return next({
      ctx: {
        ...ctx,
        session: {
          ...ctx.session,
          user: {
            ...ctx.session.user,
          },
        },
      },
    });
  })
  .mutation("create", {
    input: z.object({
      communityName: z
        .string({ required_error: "Community name is required." })
        .trim()
        .min(3, { message: "Name must be at least 3 characters long." })
        .regex(regex, {
          message:
            "Community name most only contain letters, numbers, or underscores.",
        })
        .max(25, { message: "Name must be less than 25 characters long." }),
      communityDescription: z
        .string()
        .trim()
        .max(200, { message: "Description must be less than 200 characters" })
        .optional(),
    }),
    async resolve({ input, ctx }) {
      const communityExist = await prisma.community.findUnique({
        where: {
          name: input.communityName,
        },
      });

      if (communityExist) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Sorry ${input.communityName} has already been taken. Try something else.`,
        });
      }

      const community = await prisma.community.create({
        data: {
          name: input.communityName,
          title: input.communityName,
          description: input.communityDescription,
          creator: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          moderators: {
            connectOrCreate: {
              create: {
                userId: ctx.session.user.id,
                assignedBy: ctx.session.user.id,
              },
              where: {
                id: ctx.session.user.id,
              },
            },
          },
        },
      });

      return community;
    },
  })
  .mutation("join", {
    input: z.object({
      communityId: z.string().trim().min(1),
    }),
    async resolve({ input, ctx }) {
      const isMember = await prisma.communityMember.findFirst({
        where: {
          communityId: input.communityId,
          userId: ctx.session.user.id,
        },
      });

      if (isMember) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are already a member of this community",
        });
      }

      const member = await prisma.communityMember.create({
        data: {
          communityId: input.communityId,
          userId: ctx.session.user.id,
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
        success: true,
        message: `Welcome to ${member.community.name}!`,
      };
    },
  })
  .mutation("leave", {
    input: z.object({
      communityId: z.string().trim().min(1),
    }),
    async resolve({ input, ctx }) {
      const isMember = await prisma.communityMember.findFirst({
        where: {
          communityId: input.communityId,
          userId: ctx.session.user.id,
        },
      });

      if (!isMember) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are not a member of this community",
        });
      }

      await prisma.communityMember.delete({
        where: {
          communityMemberId: {
            communityId: input.communityId,
            userId: ctx.session.user.id,
          },
        },
      });

      return {
        success: true,
        message: "You have left the community.",
      };
    },
  })
  .middleware(async ({ ctx, next }) => {
    const { communityId } = ctx.req.body["0"].json;

    const community = await prisma.community.findUnique({
      where: {
        id: communityId,
      },
      select: {
        moderators: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!community) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Community could not be found",
      });
    }

    const isModerator = community.moderators.find(
      (mod) => mod.userId === ctx.session.user.id,
    );
    const isAdmin = ctx.session.user.role === "ADMIN";

    if (!isModerator && !isAdmin) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You are not authorized",
      });
    }

    return next({
      ctx: {
        ...ctx,
        session: {
          ...ctx.session,
          user: {
            ...ctx.session.user,
          },
        },
      },
    });
  })
  .mutation("edit", {
    input: z.object({
      communityId: z.string(),
      communityTitle: z
        .string()
        .trim()
        .max(50, { message: "Title must be less than 50 characters" })
        .optional(),
      communityDescription: z
        .string()
        .trim()
        .max(200, { message: "Description must be less than 200 characters" })
        .optional(),
    }),
    async resolve({ input }) {
      const community = await prisma.community.update({
        where: {
          id: input.communityId,
        },
        data: {
          title: input.communityTitle,
          description: input.communityDescription,
        },
      });

      return {
        success: true,
        message: "Community updated",
        community,
      };
    },
  })
  .mutation("add-tag", {
    input: z.object({
      communityId: z.string(),
      tag: z
        .string()
        .trim()
        .min(1, { message: "Tag name can't be empty" })
        .max(64, { message: "Tag must be less than 64 characters long" }),
    }),
    async resolve({ input }) {
      const community = await prisma.community.findUnique({
        where: {
          id: input.communityId,
        },
        select: {
          tags: true,
        },
      });

      if (community?.tags.some((tag) => tag.name === input.tag)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Tag already exists for this community",
        });
      }

      const tag = await prisma.tags.create({
        data: {
          name: input.tag,
          community: {
            connect: {
              id: input.communityId,
            },
          },
        },
        select: {
          id: true,
          communityId: true,
          name: true,
        },
      });

      return {
        success: true,
        message: "Tag was added to this community",
        tag,
      };
    },
  })
  .mutation("remove-tag", {
    input: z.object({
      tagId: z.string(),
    }),
    async resolve({ input }) {
      const tag = await prisma.tags.delete({
        where: {
          id: input.tagId,
        },
      });

      return {
        success: true,
        message: "Tag was removed from this community",
        tag,
      };
    },
  })
  .mutation("add-moderator", {
    input: z.object({
      communityId: z.string(),
      userId: z.string(),
    }),
    async resolve({ input, ctx }) {
      const isExistingMod = await prisma.moderator.findFirst({
        where: {
          AND: {
            userId: input.userId,
            communityId: input.communityId,
          },
        },
      });

      if (isExistingMod) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User is already a moderator for this community",
        });
      }

      const moderator = await prisma.moderator.create({
        data: {
          user: {
            connect: {
              id: input.userId,
            },
          },
          community: {
            connect: {
              id: input.communityId,
            },
          },
          assignedBy: ctx.session.user.id,
        },
        select: {
          user: {
            select: {
              name: true,
            },
          },
        },
      });

      return {
        success: true,
        message: `Successfully added ${moderator.user.name} as moderator`,
      };
    },
  })
  .mutation("remove-moderator", {
    input: z.object({
      userId: z.string(),
      communityId: z.string(),
    }),
    async resolve({ input }) {
      const removedUser = await prisma.moderator.delete({
        where: {
          moderatorId: {
            userId: input.userId,
            communityId: input.communityId,
          },
        },
        select: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return {
        success: true,
        message: `${removedUser.user.name} was removed as a moderator`,
        user: removedUser.user,
      };
    },
  });
