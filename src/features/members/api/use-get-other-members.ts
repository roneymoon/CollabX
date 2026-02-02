import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export const useGetOtherMembers = ({ workspaceId }: { workspaceId: Id<"workspaces"> }) => {
    const data = useQuery(api.members.getOthers, { workspaceId });
    const isLoading = data === undefined;

    return { data, isLoading };
};
