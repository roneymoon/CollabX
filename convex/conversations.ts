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

const populateUser = (ctx: QueryCtx, userId: Id<"users">) => {
    return ctx.db.get(userId);
};

export const createOrGet = mutation({
    args: {
        workspaceId: v.id("workspaces"),
        memberId: v.id("members"),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);

        if (!userId) throw new Error("Unauthorized");

        const currentMember = await getMember(ctx, args.workspaceId, userId);

        if (!currentMember) throw new Error("Unauthorized");

        const otherMember = await ctx.db.get(args.memberId);

        if (!otherMember) throw new Error("Member not found");

        // Check if conversation already exists (bi-directional check)
        const existingConversation = await ctx.db
            .query("conversations")
            .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.workspaceId))
            .filter((q) =>
                q.or(
                    q.and(
                        q.eq(q.field("memberOneId"), currentMember._id),
                        q.eq(q.field("memberTwoId"), args.memberId)
                    ),
                    q.and(
                        q.eq(q.field("memberOneId"), args.memberId),
                        q.eq(q.field("memberTwoId"), currentMember._id)
                    )
                )
            )
            .first();

        if (existingConversation) {
            return existingConversation._id;
        }

        // Create new conversation
        const conversationId = await ctx.db.insert("conversations", {
            workspaceId: args.workspaceId,
            memberOneId: currentMember._id,
            memberTwoId: args.memberId,
        });

        return conversationId;
    },
});

export const get = query({
    args: {
        workspaceId: v.id("workspaces"),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);

        if (!userId) return [];

        const currentMember = await getMember(ctx, args.workspaceId, userId);

        if (!currentMember) return [];

        // Get all conversations where current member is a participant
        const conversations1 = await ctx.db
            .query("conversations")
            .withIndex("by_member_one_id", (q) =>
                q.eq("memberOneId", currentMember._id)
            )
            .collect();

        const conversations2 = await ctx.db
            .query("conversations")
            .withIndex("by_member_two_id", (q) =>
                q.eq("memberTwoId", currentMember._id)
            )
            .collect();

        // Deduplicate conversations using a Map keyed by conversation ID
        const conversationMap = new Map();
        [...conversations1, ...conversations2].forEach(conv => {
            conversationMap.set(conv._id, conv);
        });
        const allConversations = Array.from(conversationMap.values());

        const conversationsWithDetails = await Promise.all(
            allConversations.map(async (conversation) => {
                // Determine the other member
                const otherMemberId =
                    conversation.memberOneId === currentMember._id
                        ? conversation.memberTwoId
                        : conversation.memberOneId;

                const otherMember = await ctx.db
                    .query("members")
                    .filter((q) => q.eq(q.field("_id"), otherMemberId))
                    .first();

                if (!otherMember) return null;

                const otherUser = await populateUser(ctx, otherMember.userId);

                if (!otherUser) return null;

                // Get last message in conversation
                const lastMessage = await ctx.db
                    .query("messages")
                    .withIndex("by_conversation_id", (q) =>
                        q.eq("conversationId", conversation._id)
                    )
                    .order("desc")
                    .first();

                // Count unread messages
                const messages = await ctx.db
                    .query("messages")
                    .withIndex("by_conversation_id", (q) =>
                        q.eq("conversationId", conversation._id)
                    )
                    .collect();

                let unreadCount = 0;

                for (const message of messages) {
                    // Only count messages sent by the other member
                    if (message.memberId === otherMemberId) {
                        const status = await ctx.db
                            .query("messageStatus")
                            .withIndex("by_message_id_member_id", (q) =>
                                q.eq("messageId", message._id).eq("memberId", currentMember._id)
                            )
                            .first();

                        // If no status or status is not "seen", it's unread
                        if (!status || status.status !== "seen") {
                            unreadCount++;
                        }
                    }
                }

                // Get online presence
                const presence = await ctx.db
                    .query("userPresence")
                    .withIndex("by_user_id", (q) => q.eq("userId", otherUser._id))
                    .first();

                return {
                    _id: conversation._id,
                    _creationTime: conversation._creationTime,
                    workspaceId: conversation.workspaceId,
                    otherMember: {
                        ...otherMember,
                        user: otherUser,
                    },
                    lastMessage: lastMessage
                        ? {
                            _id: lastMessage._id,
                            body: lastMessage.body,
                            _creationTime: lastMessage._creationTime,
                        }
                        : null,
                    unreadCount,
                    isOnline: presence?.isOnline ?? false,
                    lastSeenAt: presence?.lastSeenAt ?? null,
                };
            })
        );

        return conversationsWithDetails
            .filter((conv): conv is NonNullable<typeof conv> => conv !== null)
            .sort((a, b) => {
                const aTime = a.lastMessage?._creationTime ?? a._creationTime;
                const bTime = b.lastMessage?._creationTime ?? b._creationTime;
                return bTime - aTime;
            });
    },
});

export const getById = query({
    args: {
        id: v.id("conversations"),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);

        if (!userId) return null;

        const conversation = await ctx.db.get(args.id);

        if (!conversation) return null;

        const currentMember = await getMember(ctx, conversation.workspaceId, userId);

        if (!currentMember) return null;

        // Verify user is part of this conversation
        if (
            conversation.memberOneId !== currentMember._id &&
            conversation.memberTwoId !== currentMember._id
        ) {
            return null;
        }

        // Get the other member
        const otherMemberId =
            conversation.memberOneId === currentMember._id
                ? conversation.memberTwoId
                : conversation.memberOneId;

        const otherMember = await ctx.db.get(otherMemberId);

        if (!otherMember) return null;

        const otherUser = await populateUser(ctx, otherMember.userId);

        if (!otherUser) return null;

        // Get online presence
        const presence = await ctx.db
            .query("userPresence")
            .withIndex("by_user_id", (q) => q.eq("userId", otherUser._id))
            .first();

        return {
            ...conversation,
            otherMember: {
                ...otherMember,
                user: otherUser,
            },
            isOnline: presence?.isOnline ?? false,
            lastSeenAt: presence?.lastSeenAt ?? null,
        };
    },
});
