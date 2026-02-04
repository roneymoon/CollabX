"use client";

import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader, Plus } from "lucide-react";
import Link from "next/link";
import { cn, stripHtml } from "@/lib/utils";
import { useMemberId } from "@/hooks/use-member-id";
import { SearchBox } from "./search-box";
import { useGetConversations } from "@/features/conversations/api/use-get-conversations";
import { format, isToday, isYesterday } from "date-fns";

interface MessagesSidebarProps {
  className?: string;
}

const formatMessageTime = (timestamp: number) => {
  const date = new Date(timestamp);
  if (isToday(date)) return format(date, "HH:mm");
  if (isYesterday(date)) return "Yesterday";
  return format(date, "MMM d");
};

export const MessagesSidebar = ({ className }: MessagesSidebarProps) => {
  const workspaceId = useWorkspaceId();
  const memberId = useMemberId();
  const { data: conversations, isLoading } = useGetConversations({ workspaceId });

  if (isLoading) {
    return (
      <div className="flex flex-col w-full h-full items-center justify-center bg-[#F9FAFB] dark:bg-zinc-950">
        <Loader className="size-5 animate-spin text-muted-foreground/50" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col w-full h-full bg-[#F9FAFB] dark:bg-zinc-950 border-r border-black/5 dark:border-white/5",
        className,
      )}
    >
      {/* Header */}
      <div className="px-8 pt-10 pb-6">
        <h1 className="text-[32px] font-serif font-normal text-foreground tracking-tight leading-none">
          Direct Messages
        </h1>
      </div>

      {/* Search */}
      <SearchBox />

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto px-5 space-y-1 scrollbar-hide">
        {conversations?.map((conversation) => {
          const member = conversation.otherMember;
          const isActive = memberId === member._id;
          const avatarFallback =
            member.user.name?.charAt(0).toUpperCase() || "U";

          const lastMessageBody = conversation.lastMessage?.body;
          const lastMessageTime = conversation.lastMessage?._creationTime || conversation._creationTime;

          return (
            <Link
              key={conversation._id}
              href={`/workspace/${workspaceId}/member/${member._id}`}
              className={cn(
                "flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 ease-in-out group",
                isActive
                  ? "bg-white dark:bg-zinc-900 shadow-sm"
                  : "hover:bg-white/50 dark:hover:bg-zinc-900/50",
              )}
            >
              {/* Avatar with Status Ring */}
              <div className="relative shrink-0">
                <Avatar className="size-12 rounded-full border-2 border-white dark:border-zinc-800">
                  <AvatarImage src={member.user.image} />
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                    {avatarFallback}
                  </AvatarFallback>
                </Avatar>
                {/* Status Indicator */}
                <div className={cn(
                  "absolute bottom-0 right-0 size-3 rounded-full border-2 border-[#F9FAFB] dark:border-zinc-950 transition-colors duration-200",
                  conversation.isOnline ? "bg-emerald-500" : "bg-zinc-400 dark:bg-zinc-600"
                )} />
              </div>

              {/* Text Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between mb-0.5">
                  <h3 className="text-[14px] font-medium text-foreground truncate">
                    {member.user.name}
                  </h3>
                  <span className="text-[11px] text-muted-foreground/60 font-light ml-2 shrink-0">
                    {formatMessageTime(lastMessageTime)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <p className={cn(
                    "text-[13px] font-light truncate flex-1",
                    conversation.unreadCount > 0
                      ? "text-foreground font-medium"
                      : "text-muted-foreground/70"
                  )}>
                    {lastMessageBody ? stripHtml(lastMessageBody) : "No messages yet"}
                  </p>
                  {conversation.unreadCount > 0 && (
                    <div className="size-4 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <span className="text-[10px] text-white font-bold">
                        {conversation.unreadCount}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* New Conversation Button */}
      <div className="p-6 border-t border-black/5 dark:border-white/5">
        <button className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-black/10 dark:border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-zinc-900/50 transition-all duration-200 ease-in-out">
          <Plus className="size-4" strokeWidth={1.5} />
          <span className="text-[13px] font-medium">New Conversation</span>
        </button>
      </div>
    </div>
  );
};
