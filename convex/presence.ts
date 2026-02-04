import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { auth } from "./auth";
import { Id } from "./_generated/dataModel";

export const updatePresence = mutation({
    args: {
        isOnline: v.boolean(),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);

        if (!userId) return null;

        // Check if presence record exists
        const existingPresence = await ctx.db
            .query("userPresence")
            .withIndex("by_user_id", (q) => q.eq("userId", userId))
            .first();

        if (existingPresence) {
            await ctx.db.patch(existingPresence._id, {
                isOnline: args.isOnline,
                lastSeenAt: Date.now(),
            });
        } else {
            await ctx.db.insert("userPresence", {
                userId,
                isOnline: args.isOnline,
                lastSeenAt: Date.now(),
            });
        }

        return userId;
    },
});

export const getPresence = query({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const presence = await ctx.db
            .query("userPresence")
            .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
            .first();

        if (!presence) {
            return {
                isOnline: false,
                lastSeenAt: null,
            };
        }

        return {
            isOnline: presence.isOnline,
            lastSeenAt: presence.lastSeenAt,
        };
    },
});

export const getMultiplePresences = query({
    args: {
        userIds: v.array(v.id("users")),
    },
    handler: async (ctx, args) => {
        const presences = await Promise.all(
            args.userIds.map(async (userId) => {
                const presence = await ctx.db
                    .query("userPresence")
                    .withIndex("by_user_id", (q) => q.eq("userId", userId))
                    .first();

                return {
                    userId,
                    isOnline: presence?.isOnline ?? false,
                    lastSeenAt: presence?.lastSeenAt ?? null,
                };
            })
        );

        return presences;
    },
});
