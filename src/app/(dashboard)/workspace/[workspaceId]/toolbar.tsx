"use client";

import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

export const Toolbar = () => {
  const workspaceId = useWorkspaceId();
  const { data } = useGetWorkspace({ id: workspaceId });

  return (
    <nav className="flex items-center justify-between h-3 px-4 sticky top-0 z-10 bg-background/0">
      <div className="flex-1" />

      <div className="min-w-[280px] max-w-[642px] grow-2 shrink">
        {/* Placeholder for toolbar space if needed, otherwise empty as search is in sidebar */}
      </div>

      <div className="ml-auto flex-1 flex items-center justify-end">
        {/* Top-right actions removed as per user request (extra info icon) */}
      </div>
    </nav>
  );
};
