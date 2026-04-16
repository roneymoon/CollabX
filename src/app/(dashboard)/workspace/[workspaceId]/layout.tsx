"use client";

import React from "react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { Toolbar } from "@/app/(dashboard)/workspace/[workspaceId]/toolbar";
import { Sidebar } from "@/app/(dashboard)/workspace/[workspaceId]/sidebar";
import { WorkspaceSidebar } from "./workspace-sidebar";
import { MessagesSidebar } from "./messages-sidebar";
import { ActivitySidebar } from "./activity-sidebar";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useChannelId } from "@/hooks/use-channel-id";
import { useGetChannel } from "@/features/channels/api/use-get-channel";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { ChannelInfoPanel } from "@/components/channel-info-panel";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useUpdatePresence } from "@/features/auth/api/use-update-presence";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useRouter } from "next/navigation";

interface WorkspaceIdLayoutProps {
  children: React.ReactNode;
}

const WorkspaceIdLayout = ({ children }: WorkspaceIdLayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const isMessagesRoute = pathname?.includes("/member/");
  const isActivityRoute = pathname?.includes("/activity");

  // Determine which sidebar to show
  let sidebarContent = <WorkspaceSidebar />;
  if (isMessagesRoute) {
    sidebarContent = <MessagesSidebar />;
  } else if (isActivityRoute) {
    sidebarContent = <ActivitySidebar />;
  }

  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();
  const [isChannelInfoOpen, setIsChannelInfoOpen] = useState(false);

  const { data: workspaces, isLoading: workspacesLoading } = useGetWorkspaces();
  const { data: channel } = useGetChannel({ id: channelId });
  const { data: members } = useGetMembers({ workspaceId });
  const { data: currentMember, isLoading: currentMemberLoading } = useCurrentMember({ workspaceId });
  const { mutate: updatePresence } = useUpdatePresence();

  // Redirect to root if user has no workspaces
  useEffect(() => {
    if (workspacesLoading) return;

    if (!workspaces || workspaces.length === 0) {
      router.replace("/");
    }
  }, [workspaces, workspacesLoading, router]);

  // Track user presence
  useEffect(() => {
    // Set online when component mounts
    updatePresence({ isOnline: true });

    // Set offline when component unmounts
    return () => {
      updatePresence({ isOnline: false });
    };
  }, [updatePresence]);

  // Handle tab visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        updatePresence({ isOnline: false });
      } else {
        updatePresence({ isOnline: true });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [updatePresence]);

  useEffect(() => {
    const handleToggle = () => setIsChannelInfoOpen((prev) => !prev);
    window.addEventListener("toggle-channel-info", handleToggle);
    return () => window.removeEventListener("toggle-channel-info", handleToggle);
  }, []);

  const isAdmin = currentMember?.role === "admin";

  return (
    <div className="h-full bg-background overflow-hidden">
      <div className="h-full w-full bg-card flex overflow-hidden">
        {isActivityRoute ? (
          // Activity route: No sidebar, full width for content
          <div className="flex-1 flex flex-col h-full bg-background">
            <div className="flex-1 overflow-hidden">{children}</div>
          </div>
        ) : (
          // Other routes: Show sidebar with resizable panels
          <ResizablePanelGroup
            direction="horizontal"
            autoSaveId="ca-workspace-layout"
          >
            <ResizablePanel
              defaultSize={25}
              minSize={15}
              maxSize={30}
              className="bg-white dark:bg-black"
            >
              {sidebarContent}
            </ResizablePanel>
            <ResizableHandle className="w-px bg-border/40 hover:bg-primary/40 transition-colors relative" />
            <ResizablePanel minSize={30}>
              <div className="flex flex-col h-full bg-background relative">
                <div className="flex-1 overflow-hidden">{children}</div>
              </div>
            </ResizablePanel>
            {isChannelInfoOpen && channel && members && (
              <>
                <ResizableHandle className="w-px bg-border/40 hover:bg-primary/40 transition-colors relative" />
                <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
                  <ChannelInfoPanel
                    channelId={channelId}
                    workspaceId={workspaceId}
                    title={channel.name}
                    creationTime={channel._creationTime}
                    members={members}
                    onClose={() => setIsChannelInfoOpen(false)}
                    isAdmin={isAdmin}
                    onLeave={() => {
                      // handled via existing logic or separate mutation if needed
                      setIsChannelInfoOpen(false);
                    }}
                  />
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        )}
      </div>
    </div>
  );
};

export default WorkspaceIdLayout;
