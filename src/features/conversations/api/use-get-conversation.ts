import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export const useGetConversation = ({ id }: { id: Id<"conversations"> | undefined }) => {
    const data = useQuery(api.conversations.getById, id ? { id } : "skip");
    const isLoading = data === undefined;

    return { data, isLoading };
};
