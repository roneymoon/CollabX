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

export const getPreferences = query({
    args: {
        channelId: v.id("channels"),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) return null;

        const channel = await ctx.db.get(args.channelId);
        if (!channel) return null;

        const member = await getMember(ctx, channel.workspaceId, userId);
        if (!member) return null;

        return ctx.db
            .query("channelPreferences")
            .withIndex("by_member_id_channel_id", (q) =>
                q.eq("memberId", member._id).eq("channelId", args.channelId)
            )
            .unique();
    },
});

export const updatePreferences = mutation({
    args: {
        channelId: v.id("channels"),
        isMuted: v.optional(v.boolean()),
        isStarred: v.optional(v.boolean()),
        isPinned: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Unauthorized");

        const channel = await ctx.db.get(args.channelId);
        if (!channel) throw new Error("Channel not found");

        const member = await getMember(ctx, channel.workspaceId, userId);
        if (!member) throw new Error("Unauthorized");

        const existing = await ctx.db
            .query("channelPreferences")
            .withIndex("by_member_id_channel_id", (q) =>
                q.eq("memberId", member._id).eq("channelId", args.channelId)
            )
            .unique();

        if (existing) {
            await ctx.db.patch(existing._id, {
                isMuted: args.isMuted ?? existing.isMuted,
                isStarred: args.isStarred ?? existing.isStarred,
                isPinned: args.isPinned ?? existing.isPinned,
            });
            return existing._id;
        }

        return await ctx.db.insert("channelPreferences", {
            memberId: member._id,
            channelId: args.channelId,
            isMuted: args.isMuted ?? false,
            isStarred: args.isStarred ?? false,
            isPinned: args.isPinned ?? false,
        });
    },
});
