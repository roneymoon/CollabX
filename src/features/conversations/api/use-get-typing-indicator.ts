import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";

export const useGetTypingIndicator = ({ conversationId }: { conversationId: Id<"conversations"> | undefined }) => {
    const data = useQuery(api.typingIndicators.getTyping, conversationId ? { conversationId } : "skip");
    const isLoading = data === undefined;

    return { data, isLoading };
};
