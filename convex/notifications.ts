import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { auth } from "./auth";
import { Id } from "./_generated/dataModel";

const getMember = async (
  ctx: QueryCtx,
  workspaceId: Id<"workspaces">,
  userId: Id<"users">
) => {
  return ctx.db
    .query("members")
    .withIndex("by_workspace_id_user_id", (q) =>
      q.eq("workspaceId", workspaceId).eq("userId", userId)
    )
    .unique();
};

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];

    const memberships = await ctx.db
      .query("members")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .collect();

    const memberIds = memberships.map((m) => m._id);

    const results = await Promise.all(
      memberIds.map((memberId) =>
        ctx.db
          .query("notifications")
          .withIndex("by_member_id_createdAt", (q) =>
            q.eq("memberId", memberId)
          )
          .order("desc")
          .take(50)
      )
    );

    return results.flat().sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const getUnreadCount = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return 0;

    const memberships = await ctx.db
      .query("members")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .collect();

    const counts = await Promise.all(
      memberships.map((m) =>
        ctx.db
          .query("notifications")
          .withIndex("by_member_id_isRead", (q) =>
            q.eq("memberId", m._id).eq("isRead", false)
          )
          .collect()
      )
    );

    return counts.reduce((acc, arr) => acc + arr.length, 0);
  },
});

export const markRead = mutation({
  args: { id: v.id("notifications") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const notif = await ctx.db.get(args.id);
    if (!notif) throw new Error("Not found");

    const member = await ctx.db.get(notif.memberId);
    if (!member || member.userId !== userId)
      throw new Error("Unauthorized");

    await ctx.db.patch(args.id, { isRead: true });

    return args.id;
  },
});

export const markAllRead = mutation({
  args: { workspaceId: v.optional(v.id("workspaces")) },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const memberships = await ctx.db
      .query("members")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .collect();

    const targetMembers = args.workspaceId
      ? memberships.filter((m) => m.workspaceId === args.workspaceId)
      : memberships;

    for (const m of targetMembers) {
      const notifs = await ctx.db
        .query("notifications")
        .withIndex("by_member_id_isRead", (q) =>
          q.eq("memberId", m._id).eq("isRead", false)
        )
        .collect();

      for (const n of notifs) {
        await ctx.db.patch(n._id, { isRead: true });
      }
    }

    return true;
  },
});

export const create = mutation({
  args: {
    memberId: v.id("members"),
    workspaceId: v.id("workspaces"),
    type: v.union(
      v.literal("mention"),
      v.literal("reply"),
      v.literal("reaction")
    ),
    actorMemberId: v.optional(v.id("members")),
    messageId: v.optional(v.id("messages")),
    channelId: v.optional(v.id("channels")),
    conversationId: v.optional(v.id("conversations")),
    reactionId: v.optional(v.id("reactions")),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("notifications", {
      ...args,
      isRead: false,
      createdAt: Date.now(),
    });
  },
});
