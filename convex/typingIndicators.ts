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

export const setTyping = mutation({
    args: {
        conversationId: v.id("conversations"),
        isTyping: v.boolean(),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);

        if (!userId) throw new Error("Unauthorized");

        const conversation = await ctx.db.get(args.conversationId);

        if (!conversation) throw new Error("Conversation not found");

        const member = await getMember(ctx, conversation.workspaceId, userId);

        if (!member) throw new Error("Unauthorized");

        // Verify user is part of this conversation
        if (
            conversation.memberOneId !== member._id &&
            conversation.memberTwoId !== member._id
        ) {
            throw new Error("Unauthorized");
        }

        // Check for existing typing indicator
        const existingIndicator = await ctx.db
            .query("typingIndicators")
            .withIndex("by_conversation_id", (q) =>
                q.eq("conversationId", args.conversationId)
            )
            .filter((q) => q.eq(q.field("memberId"), member._id))
            .first();

        if (existingIndicator) {
            if (args.isTyping) {
                // Update timestamp
                await ctx.db.patch(existingIndicator._id, {
                    isTyping: true,
                    timestamp: Date.now(),
                });
            } else {
                // Remove indicator when stopped typing
                await ctx.db.delete(existingIndicator._id);
            }
        } else if (args.isTyping) {
            // Create new typing indicator
            await ctx.db.insert("typingIndicators", {
                conversationId: args.conversationId,
                memberId: member._id,
                isTyping: true,
                timestamp: Date.now(),
            });
        }

        return args.conversationId;
    },
});

export const getTyping = query({
    args: {
        conversationId: v.id("conversations"),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);

        if (!userId) return null;

        const conversation = await ctx.db.get(args.conversationId);

        if (!conversation) return null;

        const member = await getMember(ctx, conversation.workspaceId, userId);

        if (!member) return null;

        // Get the other member
        const otherMemberId =
            conversation.memberOneId === member._id
                ? conversation.memberTwoId
                : conversation.memberOneId;

        // Get typing indicator for the other member
        const indicators = await ctx.db
            .query("typingIndicators")
            .withIndex("by_conversation_id", (q) =>
                q.eq("conversationId", args.conversationId)
            )
            .filter((q) => q.eq(q.field("memberId"), otherMemberId))
            .collect();

        // Filter out stale indicators (older than 5 seconds)
        const now = Date.now();
        const validIndicators = indicators.filter(
            (indicator) => now - indicator.timestamp < 5000 && indicator.isTyping
        );

        if (validIndicators.length > 0) {
            const otherMember = await ctx.db.get(otherMemberId);
            if (!otherMember) return null;

            const otherUser = await ctx.db.get(otherMember.userId);
            if (!otherUser) return null;

            return {
                isTyping: true,
                memberName: otherUser.name,
            };
        }

        return null;
    },
});
