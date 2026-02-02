import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useWorkspaceId } from "./use-workspace-id";
import { Id } from "../../convex/_generated/dataModel";

export const useNavigateToMessage = () => {
    const router = useRouter();
    const workspaceId = useWorkspaceId();

    return useCallback(
        (messageId: Id<"messages">, targetMemberId: Id<"members">) => {
            // Navigate to the member URL with the messageId as a highlight parameter
            // DMs are routed via: /workspace/[id]/member/[targetMemberId]

            let url = `/workspace/${workspaceId}/member/${targetMemberId}`;

            if (messageId) {
                url += `?highlightMessage=${messageId}`;
            }

            router.push(url);
        },
        [router, workspaceId]
    );
};
