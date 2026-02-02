import { v } from "convex/values";
import { query, QueryCtx } from "./_generated/server";
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

export const searchDirectMessages = query({
    args: {
        workspaceId: v.id("workspaces"),
        query: v.string(),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);

        if (!userId) {
            return {
                conversations: [],
                messages: [],
            };
        }

        const currentMember = await getMember(ctx, args.workspaceId, userId);

        if (!currentMember) {
            return {
                conversations: [],
                messages: [],
            };
        }

        const normalizedQuery = args.query.toLowerCase().trim();
        const searchLimit = args.limit ?? 20;

        if (normalizedQuery.length < 2) {
            return {
                conversations: [],
                messages: [],
            };
        }

        // 1. Get all conversations the user is part of
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

        const conversationMap = new Map();
        [...conversations1, ...conversations2].forEach(conv => {
            if (conv.workspaceId === args.workspaceId) {
                conversationMap.set(conv._id, conv);
            }
        });
        const myConversations = Array.from(conversationMap.values());
        const myConversationIds = new Set(myConversations.map(c => c._id));

        // 2. Search Conversations by participant name
        const matchingConversations = [];
        for (const conv of myConversations) {
            const otherMemberId = conv.memberOneId === currentMember._id
                ? conv.memberTwoId
                : conv.memberOneId;

            const otherMember = await ctx.db.get(otherMemberId);
            if (!otherMember || !("userId" in otherMember)) continue;

            const otherUser = await ctx.db.get(otherMember.userId);
            if (!otherUser) continue;

            if (otherUser.name?.toLowerCase().includes(normalizedQuery)) {
                // Get last message for preview
                const lastMessage = await ctx.db
                    .query("messages")
                    .withIndex("by_conversation_id", (q) =>
                        q.eq("conversationId", conv._id)
                    )
                    .order("desc")
                    .first();

                matchingConversations.push({
                    _id: conv._id,
                    otherMember: {
                        _id: otherMember._id,
                        name: otherUser.name,
                        image: otherUser.image,
                    },
                    lastMessage: lastMessage ? {
                        body: lastMessage.body,
                        _creationTime: lastMessage._creationTime,
                    } : null,
                    matchType: "participant",
                });
            }

            if (matchingConversations.length >= searchLimit) break;
        }

        // 3. Search Messages by content
        const matchingMessages = [];
        const messagesInWorkspace = await ctx.db
            .query("messages")
            .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.workspaceId))
            .collect();

        for (const msg of messagesInWorkspace) {
            if (msg.conversationId && myConversationIds.has(msg.conversationId)) {
                if (msg.body.toLowerCase().includes(normalizedQuery)) {
                    const sender = await ctx.db.get(msg.memberId);
                    const senderUser = (sender && "userId" in sender)
                        ? await ctx.db.get(sender.userId)
                        : null;

                    // For messages, we need to know the 'other member' to route to the DM
                    // If the user matches a message, the DM is based on the conversation participants.
                    const conv = conversationMap.get(msg.conversationId);
                    const otherMemberId = conv ? (conv.memberOneId === currentMember._id
                        ? conv.memberTwoId
                        : conv.memberOneId) : msg.memberId;

                    matchingMessages.push({
                        _id: msg._id,
                        body: msg.body,
                        conversationId: msg.conversationId,
                        targetMemberId: otherMemberId, // Explicitly named for routing
                        sender: senderUser ? {
                            name: senderUser.name,
                            image: senderUser.image,
                        } : null,
                        _creationTime: msg._creationTime,
                    });
                }
            }
            if (matchingMessages.length >= searchLimit) break;
        }

        return {
            conversations: matchingConversations.map(c => ({
                ...c,
                targetMemberId: c.otherMember._id
            })),
            messages: matchingMessages,
        };
    },
});
