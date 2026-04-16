"use client";

import { useMemberId } from "@/hooks/use-member-id";
import { useGetMember } from "@/features/members/api/use-get-member";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import { Loader, Phone, Video, Info, AlertTriangle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileRail } from "@/components/ui/profile-rail";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useCreateOrGetConversation } from "@/features/conversations/api/use-create-or-get-conversation";
import { useEffect, useState } from "react";
import { Id } from "@convex/_generated/dataModel";
import { toast } from "sonner";
import { MessageList } from "@/components/message-list";
import ChatInput from "../../channel/[channelId]/chat-input";
import { useMarkConversationAsRead } from "@/features/conversations/api/use-mark-conversation-as-read";
import { useGetConversation } from "@/features/conversations/api/use-get-conversation";
import { useGetTypingIndicator } from "@/features/conversations/api/use-get-typing-indicator";
import { formatDistanceToNow } from "date-fns";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

const MemberIdPage = () => {
  const memberId = useMemberId();
  const workspaceId = useWorkspaceId();

  const [conversationId, setConversationId] = useState<Id<"conversations"> | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(true);

  const { data: currentMember } = useCurrentMember({ workspaceId });
  const { data: member, isLoading: memberLoading } = useGetMember({
    id: memberId,
  });

  const { mutate: createOrGetConversation, isPending: conversationPending } =
    useCreateOrGetConversation();

  const messagesData = useGetMessages({
    conversationId: conversationId || undefined,
  });

  const { data: conversation } = useGetConversation({
    id: conversationId || undefined,
  });

  const { data: typingIndicator } = useGetTypingIndicator({
    conversationId: conversationId || undefined,
  });

  const { mutate: markAsRead } = useMarkConversationAsRead();

  // Create or get conversation on mount
  useEffect(() => {
    if (workspaceId && memberId) {
      createOrGetConversation(
        { workspaceId, memberId },
        {
          onSuccess: (id) => {
            setConversationId(id);
          },
          onError: () => {
            toast.error("Failed to load conversation");
          },
        }
      );
    }
  }, [workspaceId, memberId, createOrGetConversation]);

  // Mark conversation as read when viewing
  useEffect(() => {
    if (conversationId) {
      markAsRead({ conversationId });
    }
  }, [conversationId, markAsRead]);

  if (memberLoading || conversationPending) {
    return (
      <div className="h-full flex items-center justify-center bg-[#FDFDFD] dark:bg-black">
        <Loader className="size-6 animate-spin text-muted-foreground/50" />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="h-full flex flex-col gap-y-2 items-center justify-center bg-[#FDFDFD] dark:bg-black">
        <AlertTriangle className="size-6 text-muted-foreground/50" />
        <p className="text-muted-foreground text-sm">Member not found</p>
      </div>
    );
  }

  const avatarFallback = member.user.name?.charAt(0).toUpperCase() || "U";
  const isOnline = conversation?.isOnline ?? false;
  const lastSeenAt = conversation?.lastSeenAt;

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full">
      {/* Chat Window */}
      <ResizablePanel minSize={40}>
        <div className="h-full flex flex-col bg-[#FDFDFD] dark:bg-black">
          {/* Chat Header */}
          <div className="h-[72px] border-b border-black/5 dark:border-white/5 px-8 flex items-center justify-between bg-white dark:bg-zinc-950">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="size-10 rounded-full border-2 border-white dark:border-zinc-900">
                  <AvatarImage src={member.user.image} />
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                    {avatarFallback}
                  </AvatarFallback>
                </Avatar>
                {/* Online status indicator */}
                {isOnline && (
                  <div className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-emerald-500 border-[2px] border-white dark:border-zinc-950" />
                )}
              </div>
              <div>
                <h2 className="text-[15px] font-medium text-foreground">
                  {member.user.name}
                </h2>
                {/* Online/Last seen status */}
                <p className="text-xs text-muted-foreground">
                  {isOnline
                    ? "Online"
                    : lastSeenAt
                      ? `Last seen ${formatDistanceToNow(lastSeenAt, { addSuffix: true })}`
                      : "Offline"}
                </p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2">
              <button className="size-9 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 flex items-center justify-center transition-colors">
                <Phone
                  className="size-4 text-muted-foreground"
                  strokeWidth={1.5}
                />
              </button>
              <button className="size-9 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 flex items-center justify-center transition-colors">
                <Video
                  className="size-4 text-muted-foreground"
                  strokeWidth={1.5}
                />
              </button>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="size-9 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 flex items-center justify-center transition-colors"
              >
                <Info
                  className="size-4 text-muted-foreground"
                  strokeWidth={1.5}
                />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <MessageList
            memberName={member.user.name}
            memberImage={member.user.image}
            data={messagesData?.results}
            loadMore={messagesData?.loadMore}
            isLoadingMore={messagesData?.status === "LoadingMore"}
            canLoadMore={messagesData?.status === "CanLoadMore"}
            variant="conversation"
          />

          {/* Premium Typing Indicator */}
          {typingIndicator?.memberName && (
            <div className="px-8 pb-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-primary/5 via-primary/3 to-transparent border border-primary/10 backdrop-blur-sm shadow-sm">
                {/* Animated Gradient Dots */}
                <div className="flex gap-1 items-center">
                  <div className="size-[6px] rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 animate-[bounce_1s_ease-in-out_infinite] [animation-delay:-0.32s] shadow-sm shadow-blue-400/50" />
                  <div className="size-[6px] rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 animate-[bounce_1s_ease-in-out_infinite] [animation-delay:-0.16s] shadow-sm shadow-cyan-400/50" />
                  <div className="size-[6px] rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 animate-[bounce_1s_ease-in-out_infinite] shadow-sm shadow-teal-400/50" />
                </div>

                {/* Text with Icon */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px] font-medium text-foreground/80">
                    {typingIndicator.memberName}
                  </span>
                  <span className="text-[13px] text-muted-foreground/60">is typing</span>
                  {/* Animated ellipsis */}
                  <span className="inline-flex gap-[2px] ml-0.5">
                    <span className="animate-[ping_1.5s_ease-in-out_infinite] [animation-delay:0s] text-primary/60">.</span>
                    <span className="animate-[ping_1.5s_ease-in-out_infinite] [animation-delay:0.2s] text-primary/60">.</span>
                    <span className="animate-[ping_1.5s_ease-in-out_infinite] [animation-delay:0.4s] text-primary/60">.</span>
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Message Input */}
          <ChatInput
            placeholder={`Message ${member.user.name}`}
            conversationId={conversationId}
          />
        </div>
      </ResizablePanel>

      {/* Profile Rail - Toggleable */}
      {isProfileOpen && (
        <>
          <ResizableHandle className="w-px bg-border/40 hover:bg-primary/40 transition-colors relative" />
          <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
            <ProfileRail
              name={member.user.name || "Unknown"}
              image={member.user.image}
            />
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  );
};

export default MemberIdPage;
