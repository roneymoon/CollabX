import { v } from "convex/values";
import { mutation, QueryCtx } from "./_generated/server";
import { auth } from "./auth";
import { Id } from "./_generated/dataModel";

// In-memory cooldown tracking to prevent spam
const reactionCooldowns = new Map<string, number>();
const COOLDOWN_MS = 500;

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

/**
 * Toggles a reaction for a message.
 * If the reaction exists, it is removed. Otherwise, it is added.
 */
export const toggle = mutation({
  args: {
    messageId: v.id("messages"),
    value: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const message = await ctx.db.get(args.messageId);
    if (!message) throw new Error("Message not found");

    const member = await getMember(ctx, message.workspaceId, userId);
    if (!member) throw new Error("Unauthorized");

    const cooldownKey = `${member._id}`;
    const now = Date.now();
    const lastReactionTime = reactionCooldowns.get(cooldownKey) || 0;

    if (now - lastReactionTime < COOLDOWN_MS) {
      throw new Error("Slow down");
    }
    reactionCooldowns.set(cooldownKey, now);

    const existingReaction = await ctx.db
      .query("reactions")
      .withIndex("by_message_id", (q) => q.eq("messageId", args.messageId))
      .filter((q) =>
        q.and(
          q.eq(q.field("memberId"), member._id),
          q.eq(q.field("value"), args.value)
        )
      )
      .first();

    if (existingReaction) {
      await ctx.db.delete(existingReaction._id);
      return { added: false };
    }

    const reactionId = await ctx.db.insert("reactions", {
      workspaceId: message.workspaceId,
      messageId: args.messageId,
      memberId: member._id,
      value: args.value,
    });

    if (message.memberId !== member._id) {
      await ctx.db.insert("notifications", {
        memberId: message.memberId,
        workspaceId: message.workspaceId,
        channelId: message.channelId,
        conversationId: message.conversationId,
        messageId: message._id,
        reactionId,
        actorMemberId: member._id,
        type: "reaction",
        isRead: false,
        createdAt: Date.now(),
      });
    }

    return { added: true };
  },
});


