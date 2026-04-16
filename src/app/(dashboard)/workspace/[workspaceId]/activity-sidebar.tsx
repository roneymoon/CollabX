"use client";

import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useChannelId } from "@/hooks/use-channel-id";
import { Loader, Hash } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ActivitySidebarProps {
  className?: string;
}

export const ActivitySidebar = ({ className }: ActivitySidebarProps) => {
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();
  const { data: channels, isLoading } = useGetChannels({ workspaceId });

  if (isLoading) {
    return (
      <div className="flex flex-col w-[280px] h-full items-center justify-center bg-[#F9FAFB] dark:bg-zinc-950">
        <Loader className="size-5 animate-spin text-muted-foreground/50" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col w-[280px] h-full bg-[#F9FAFB] dark:bg-zinc-950 border-r border-black/5 dark:border-white/5",
        className,
      )}
    >
      {/* Header */}
      <div className="px-6 pt-10 pb-6">
        <h2 className="text-[13px] font-medium tracking-[0.15em] text-muted-foreground/60 uppercase mb-4">
          Activity Channels
        </h2>
      </div>

      {/* Channel List */}
      <div className="flex-1 overflow-y-auto px-4 space-y-1 scrollbar-hide">
        {channels?.map((channel) => {
          const isActive = channelId === channel._id;

          return (
            <Link
              key={channel._id}
              href={`/workspace/${workspaceId}/channel/${channel._id}`}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ease-out group",
                isActive
                  ? "bg-white dark:bg-zinc-900 shadow-sm"
                  : "hover:bg-white/50 dark:hover:bg-zinc-900/50",
              )}
            >
              <Hash
                className={cn(
                  "size-4 shrink-0 transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground/40 group-hover:text-muted-foreground/60",
                )}
                strokeWidth={2}
              />
              <span
                className={cn(
                  "text-[14px] font-medium truncate transition-colors",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground/70 group-hover:text-foreground",
                )}
              >
                {channel.name}
              </span>
              {isActive && (
                <div className="ml-auto size-1.5 rounded-full bg-primary shrink-0" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Collaborators Widget (Glassmorphic Card) */}
      <div className="p-6">
        <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl rounded-2xl p-4 border border-black/10 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-medium tracking-[0.12em] text-muted-foreground/60 uppercase">
              Active Now
            </span>
            <div className="flex items-center gap-1.5">
              <div className="size-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[12px] font-semibold text-emerald-600 dark:text-emerald-400">
                4 Active
              </span>
            </div>
          </div>

          {/* Overlapping Avatars */}
          <div className="flex items-center -space-x-2">
            <Avatar className="size-8 rounded-full border-2 border-white dark:border-zinc-900 ring-1 ring-black/5">
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                AR
              </AvatarFallback>
            </Avatar>
            <Avatar className="size-8 rounded-full border-2 border-white dark:border-zinc-900 ring-1 ring-black/5">
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback className="bg-emerald-500/10 text-emerald-600 text-xs font-semibold">
                SC
              </AvatarFallback>
            </Avatar>
            <Avatar className="size-8 rounded-full border-2 border-white dark:border-zinc-900 ring-1 ring-black/5">
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback className="bg-blue-500/10 text-blue-600 text-xs font-semibold">
                JW
              </AvatarFallback>
            </Avatar>
            <Avatar className="size-8 rounded-full border-2 border-white dark:border-zinc-900 ring-1 ring-black/5">
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback className="bg-amber-500/10 text-amber-600 text-xs font-semibold">
                RM
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </div>
  );
};
