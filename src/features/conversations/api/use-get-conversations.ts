import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useMemo } from "react";

export const useGetConversations = ({
    workspaceId,
}: {
    workspaceId: Id<"workspaces">;
}) => {
    const data = useQuery(api.conversations.get, { workspaceId });
    const isLoading = data === undefined;

    // Client-side deduplication to prevent React key errors
    // This handles edge cases where duplicate conversation records exist in DB
    const deduplicatedData = useMemo(() => {
        if (!data) return data;

        const seen = new Set<string>();
        return data.filter((conversation) => {
            if (seen.has(conversation._id)) {
                console.warn(`Duplicate conversation detected: ${conversation._id}`);
                return false;
            }
            seen.add(conversation._id);
            return true;
        });
    }, [data]);

    return { data: deduplicatedData, isLoading };
};
