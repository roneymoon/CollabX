import { v } from "convex/values";

import { auth } from "./auth";
import { query, QueryCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";

const populateUser = (ctx: QueryCtx, id: Id<"users">) => {
  return ctx.db.get(id);
};

export const get = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      return [];
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId),
      )
      .unique();

    if (!member) {
      return [];
    }

    const data = await ctx.db
      .query("members")
      .withIndex("by_workspace_id", (q) =>
        q.eq("workspaceId", args.workspaceId),
      )
      .collect();

    const members = [];

    for (const member of data) {
      const user = await populateUser(ctx, member.userId);

      if (user) {
        members.push({
          ...member,
          user,
        });
      }
    }

    return members;
  },
});

export const getById = query({
  args: { id: v.id("members") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      return null;
    }

    const member = await ctx.db.get(args.id);

    if (!member) {
      return null;
    }

    const user = await populateUser(ctx, member.userId);

    if (!user) {
      return null;
    }

    return {
      ...member,
      user,
    };
  },
});

export const current = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      return null;
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId),
      )
      .unique();

    if (!member) {
      return null;
    }

    return member;
  },
});

export const getOthers = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      return [];
    }

    const currentMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId),
      )
      .unique();

    if (!currentMember) {
      return [];
    }

    const allMembers = await ctx.db
      .query("members")
      .withIndex("by_workspace_id", (q) =>
        q.eq("workspaceId", args.workspaceId),
      )
      .collect();

    const members = [];

    for (const member of allMembers) {
      // Exclude current user
      if (member._id === currentMember._id) {
        continue;
      }

      const user = await populateUser(ctx, member.userId);

      if (user) {
        // Check if conversation already exists
        const existingConversation = await ctx.db
          .query("conversations")
          .filter((q) =>
            q.or(
              q.and(
                q.eq(q.field("memberOneId"), currentMember._id),
                q.eq(q.field("memberTwoId"), member._id)
              ),
              q.and(
                q.eq(q.field("memberOneId"), member._id),
                q.eq(q.field("memberTwoId"), currentMember._id)
              )
            )
          )
          .first();

        members.push({
          ...member,
          user,
          conversationId: existingConversation?._id,
        });
      }
    }

    return members;
  },
});

