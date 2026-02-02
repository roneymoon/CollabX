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

export const updateStatus = mutation({
    args: {
        messageId: v.id("messages"),
        status: v.union(
            v.literal("sent"),
            v.literal("delivered"),
            v.literal("seen")
        ),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);

        if (!userId) throw new Error("Unauthorized");

        const message = await ctx.db.get(args.messageId);

        if (!message) throw new Error("Message not found");

        const member = await getMember(ctx, message.workspaceId, userId);

        if (!member) throw new Error("Unauthorized");

        // Check if status record already exists
        const existingStatus = await ctx.db
            .query("messageStatus")
            .withIndex("by_message_id_member_id", (q) =>
                q.eq("messageId", args.messageId).eq("memberId", member._id)
            )
            .first();

        if (existingStatus) {
            // Update existing status (only if new status is "higher" in the hierarchy)
            const statusHierarchy = { sent: 1, delivered: 2, seen: 3 };
            const currentLevel = statusHierarchy[existingStatus.status];
            const newLevel = statusHierarchy[args.status];

            if (newLevel > currentLevel) {
                await ctx.db.patch(existingStatus._id, {
                    status: args.status,
                    timestamp: Date.now(),
                });
            }
        } else {
            // Create new status record
            await ctx.db.insert("messageStatus", {
                messageId: args.messageId,
                memberId: member._id,
                status: args.status,
                timestamp: Date.now(),
            });
        }

        return args.messageId;
    },
});

export const markConversationAsRead = mutation({
    args: {
        conversationId: v.id("conversations"),
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

        // Get all messages in the conversation
        const messages = await ctx.db
            .query("messages")
            .withIndex("by_conversation_id", (q) =>
                q.eq("conversationId", args.conversationId)
            )
            .collect();

        // Mark all messages as seen that were sent by the other member
        for (const message of messages) {
            // Only mark messages sent by the other member
            if (message.memberId !== member._id) {
                const existingStatus = await ctx.db
                    .query("messageStatus")
                    .withIndex("by_message_id_member_id", (q) =>
                        q.eq("messageId", message._id).eq("memberId", member._id)
                    )
                    .first();

                if (existingStatus) {
                    if (existingStatus.status !== "seen") {
                        await ctx.db.patch(existingStatus._id, {
                            status: "seen",
                            timestamp: Date.now(),
                        });
                    }
                } else {
                    await ctx.db.insert("messageStatus", {
                        messageId: message._id,
                        memberId: member._id,
                        status: "seen",
                        timestamp: Date.now(),
                    });
                }
            }
        }

        return args.conversationId;
    },
});

export const getUnreadCount = query({
    args: {
        conversationId: v.id("conversations"),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);

        if (!userId) return 0;

        const conversation = await ctx.db.get(args.conversationId);

        if (!conversation) return 0;

        const member = await getMember(ctx, conversation.workspaceId, userId);

        if (!member) return 0;

        // Get the other member
        const otherMemberId =
            conversation.memberOneId === member._id
                ? conversation.memberTwoId
                : conversation.memberOneId;

        // Get all messages in conversation
        const messages = await ctx.db
            .query("messages")
            .withIndex("by_conversation_id", (q) =>
                q.eq("conversationId", args.conversationId)
            )
            .collect();

        let unreadCount = 0;

        for (const message of messages) {
            // Only count messages sent by the other member
            if (message.memberId === otherMemberId) {
                const status = await ctx.db
                    .query("messageStatus")
                    .withIndex("by_message_id_member_id", (q) =>
                        q.eq("messageId", message._id).eq("memberId", member._id)
                    )
                    .first();

                if (!status || status.status !== "seen") {
                    unreadCount++;
                }
            }
        }

        return unreadCount;
    },
});

export const getMessageStatus = query({
    args: {
        messageId: v.id("messages"),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);

        if (!userId) return null;

        const message = await ctx.db.get(args.messageId);

        if (!message) return null;

        const member = await getMember(ctx, message.workspaceId, userId);

        if (!member) return null;

        // Get the conversation to find the other member
        if (!message.conversationId) return null;

        const conversation = await ctx.db.get(message.conversationId);

        if (!conversation) return null;

        // Get the other member (recipient)
        const otherMemberId =
            conversation.memberOneId === member._id
                ? conversation.memberTwoId
                : conversation.memberOneId;

        // Get status for the other member
        const status = await ctx.db
            .query("messageStatus")
            .withIndex("by_message_id_member_id", (q) =>
                q.eq("messageId", args.messageId).eq("memberId", otherMemberId)
            )
            .first();

        return status;
    },
});
