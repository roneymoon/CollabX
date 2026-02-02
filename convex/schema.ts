import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";

const schema = defineSchema({
  ...authTables,
  workspaces: defineTable({
    name: v.string(),
    userId: v.id("users"),
    joinCode: v.string(),
  }),
  members: defineTable({
    userId: v.id("users"),
    workspaceId: v.id("workspaces"),
    role: v.union(v.literal("admin"), v.literal("member")), // 'admin' or 'member'  
  })
    .index("by_user_id", ["userId"])
    .index("by_workspace_id", ["workspaceId"])
    .index("by_workspace_id_user_id", ["workspaceId", "userId"]),
  channels: defineTable({
    name: v.string(),
    workspaceId: v.id("workspaces")
  })
    .index("by_workspace_id", ["workspaceId"]),

  conversations: defineTable({
    workspaceId: v.id("workspaces"),
    memberOneId: v.id("members"),
    memberTwoId: v.id("members"),
  })
    .index("by_workspace_id", ["workspaceId"])
    .index("by_member_one_id", ["memberOneId"])
    .index("by_member_two_id", ["memberTwoId"]),
  messages: defineTable({
    body: v.string(),
    image: v.optional(v.id("_storage")),
    channelId: v.optional(v.id("channels")),
    memberId: v.id("members"),
    workspaceId: v.id("workspaces"),
    parentMessageId: v.optional(v.id("messages")),
    // todo : add conversationId
    conversationId: v.optional(v.id("conversations")),
    updatedAt: v.optional(v.number())
  })
    .index("by_workspace_id", ["workspaceId"])
    .index("by_member_id", ["memberId"])
    .index("by_channel_id", ["channelId"])
    .index("by_parent_message_id", ["parentMessageId"])
    .index("by_conversation_id", ["conversationId"])
    .index("by_channel_id_parent_message_id_conversation_id", [
      "channelId",
      "parentMessageId",
      "conversationId"
    ]),

  reactions: defineTable({
    workspaceId: v.id("workspaces"),
    messageId: v.id("messages"),
    memberId: v.id("members"),
    value: v.string(),
  })
    .index("by_workspace_id", ["workspaceId"])
    .index("by_message_id", ["messageId"])
    .index("by_member_id", ["memberId"]),

  channelPreferences: defineTable({
    memberId: v.id("members"),
    channelId: v.id("channels"),
    isMuted: v.boolean(),
    isStarred: v.boolean(),
    isPinned: v.boolean(),
  })
    .index("by_member_id", ["memberId"])
    .index("by_channel_id", ["channelId"])
    .index("by_member_id_channel_id", ["memberId", "channelId"]),

  messageStatus: defineTable({
    messageId: v.id("messages"),
    memberId: v.id("members"),
    status: v.union(
      v.literal("sent"),
      v.literal("delivered"),
      v.literal("seen")
    ),
    timestamp: v.number(),
  })
    .index("by_message_id", ["messageId"])
    .index("by_member_id", ["memberId"])
    .index("by_message_id_member_id", ["messageId", "memberId"]),

  typingIndicators: defineTable({
    conversationId: v.id("conversations"),
    memberId: v.id("members"),
    isTyping: v.boolean(),
    timestamp: v.number(),
  })
    .index("by_conversation_id", ["conversationId"])
    .index("by_member_id", ["memberId"]),

  userPresence: defineTable({
    userId: v.id("users"),
    isOnline: v.boolean(),
    lastSeenAt: v.number(),
  })
    .index("by_user_id", ["userId"]),
});


export default schema;