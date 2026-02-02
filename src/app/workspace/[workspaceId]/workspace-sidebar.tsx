"use client";

import { WorkspaceHeader } from "@/app/workspace/[workspaceId]/workspace-header";

import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";

import { useWorkspaceId } from "@/hooks/use-workspace-id";
import {
  AlertTriangle,
  HashIcon,
  Loader,
  MessageSquareText,
  SendHorizontal,
} from "lucide-react";

import { SidebarItem } from "./sidebar-item";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { WorkspaceSection } from "./workspace-section";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useChannelId } from "@/hooks/use-channel-id";

import { UserItem } from "./user-item";
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";
import { UserButton } from "@/features/auth/components/user-button";
import { ModeToggle } from "@/components/mode-toggle";
import { useCurrentUser } from "@/features/auth/api/use-current-user";
import { useGetOtherMembers } from "@/features/members/api/use-get-other-members";
import { ConversationItem } from "./conversation-item";
import { useGetConversations } from "@/features/conversations/api/use-get-conversations";
import { NewDirectMessageDialog } from "./new-direct-message-dialog";
import { useState } from "react";
import { ConversationListSkeleton } from "./conversation-skeleton";
import { EmptyConversations } from "./empty-conversations";


export const WorkspaceSidebar = () => {
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();
  const { data: user } = useCurrentUser();

  const [_open, setOpen] = useCreateChannelModal();
  const [newDMDialogOpen, setNewDMDialogOpen] = useState(false);

  const { data: member, isLoading: memberLoading } = useCurrentMember({
    workspaceId,
  });
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });
  const { data: channels, isLoading: channelsLoading } = useGetChannels({
    workspaceId,
  });
  const { data: members, isLoading: membersLoading } = useGetMembers({
    workspaceId,
  });
  const { data: otherMembers, isLoading: otherMembersLoading } = useGetOtherMembers({
    workspaceId,
  });
  const { data: conversations, isLoading: conversationsLoading } = useGetConversations({
    workspaceId,
  });

  if (workspaceLoading || memberLoading) {
    return (
      <div className="flex flex-col bg-sidebar w-[240px] h-full items-center justify-center">
        <Loader className="size-5 animate-spin text-muted-foreground/50" />
      </div>
    );
  }

  if (!workspace || !member) {
    return (
      <div className="flex flex-col gap-y-2 bg-sidebar w-[240px] h-full items-center justify-center">
        <AlertTriangle className="size-5 text-muted-foreground/50" />
        <p className="text-muted-foreground/80 text-sm font-medium">
          Workspace not found
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white dark:bg-black h-full sidebar-item-transition border-none overflow-hidden">
      <WorkspaceHeader
        workspace={workspace}
        isAdmin={member.role === "admin"}
      />

      <div className="px-6 mb-2 mt-1">
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Loader className="size-3 text-muted-foreground/30 hidden group-focus-within:block animate-spin" />
            <svg
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="size-3.5 text-muted-foreground/40 block group-focus-within:hidden"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Jump to..."
            className="w-full bg-[#f3f4f6] dark:bg-zinc-900 border-none rounded-full py-2 pl-11 pr-4 text-[13px] focus:bg-white dark:focus:bg-zinc-800 transition-all outline-none placeholder:text-muted-foreground/40 text-foreground shadow-sm"
          />
        </div>
      </div>

      <div className="flex flex-col flex-1 mt-1 space-y-0.5 overflow-y-auto scrollbar-hide px-2 pb-4">
        <div className="px-5 mb-1 mt-2">
          <p className="text-[13px] text-foreground/50 font-sans font-semibold tracking-tight uppercase">
            Core
          </p>
        </div>
        <SidebarItem label="Threads" icon={MessageSquareText} id="threads" />
        <SidebarItem label="Drafts & Sent" icon={SendHorizontal} id="drafts" />

        <div className="mt-1">
          <WorkspaceSection
            label="channels"
            hint="New channel"
            onNew={member.role === "admin" ? () => setOpen(true) : undefined}
          >
            {channels?.map((item) => (
              <SidebarItem
                key={item._id}
                icon={HashIcon}
                label={item.name}
                id={item._id}
                variant={channelId == item._id ? "active" : "default"}
              />
            ))}
          </WorkspaceSection>
        </div>

        <div className="mt-1">
          <WorkspaceSection
            label="Direct Messages"
            hint="New Direct Message"
            onNew={() => setNewDMDialogOpen(true)}
          >
            {conversationsLoading ? (
              <ConversationListSkeleton />
            ) : conversations && conversations.length > 0 ? (
              conversations.map((conversation) => (
                <ConversationItem
                  key={conversation._id}
                  id={conversation.otherMember._id}
                  label={conversation.otherMember.user?.name || "Unknown"}
                  image={conversation.otherMember.user?.image}
                  unreadCount={conversation.unreadCount}
                  isOnline={conversation.isOnline}
                />
              ))
            ) : (
              <EmptyConversations />
            )}
          </WorkspaceSection>
        </div>


      </div>

      <NewDirectMessageDialog
        open={newDMDialogOpen}
        onOpenChange={setNewDMDialogOpen}
      />
    </div>
  );
};
