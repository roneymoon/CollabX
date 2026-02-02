import { mutation } from "./_generated/server";
import { auth } from "./auth";

/**
 * One-time cleanup mutation to remove duplicate conversation records.
 * Run this to clean up any duplicate conversations that were created before
 * the workspace filtering fix was added.
 */
export const removeDuplicateConversations = mutation({
    args: {},
    handler: async (ctx) => {
        const userId = await auth.getUserId(ctx);

        if (!userId) throw new Error("Unauthorized");

        // Get all conversations
        const allConversations = await ctx.db.query("conversations").collect();

        // Group by unique pair (sorted member IDs + workspace)
        const conversationGroups = new Map<string, typeof allConversations>();

        for (const conv of allConversations) {
            // Create a unique key for this pair
            const memberIds = [conv.memberOneId, conv.memberTwoId].sort();
            const key = `${conv.workspaceId}-${memberIds[0]}-${memberIds[1]}`;

            if (!conversationGroups.has(key)) {
                conversationGroups.set(key, []);
            }
            conversationGroups.get(key)!.push(conv);
        }

        let duplicatesRemoved = 0;

        // For each group with duplicates, keep the oldest and delete the rest
        for (const [key, conversations] of conversationGroups.entries()) {
            if (conversations.length > 1) {
                // Sort by creation time (oldest first)
                conversations.sort((a, b) => a._creationTime - b._creationTime);

                // Keep the first (oldest), delete the rest
                for (let i = 1; i < conversations.length; i++) {
                    await ctx.db.delete(conversations[i]._id);
                    duplicatesRemoved++;
                    console.log(`Deleted duplicate conversation: ${conversations[i]._id}`);
                }
            }
        }

        return {
            success: true,
            duplicatesRemoved,
            message: `Removed ${duplicatesRemoved} duplicate conversation(s)`,
        };
    },
});
