"use client";

import { format, isToday, isYesterday } from "date-fns";
import dynamic from "next/dynamic";
import { toast } from "sonner";

import { Doc, Id } from "@convex/_generated/dataModel";
import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageActions } from "@/components/message-actions";
import { Thumbnail } from "@/components/thumbnail";
import { Hint } from "@/components/hints";
import { Reactions } from "@/components/reactions";

const Renderer = dynamic(() => import("@/components/renderer"), { ssr: false });
const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface MessageProps {
  id: Id<"messages">;
  memberId: Id<"members">;
  authorImage?: string;
  authorName?: string;
  isAuthor: boolean;
  reactions: Array<
    Omit<Doc<"reactions">, "memberId"> & {
      count: number;
      memberIds: Id<"members">[];
    }
  >;
  body: Doc<"messages">["body"];
  image: string | null | undefined;
  createdAt: Doc<"messages">["_creationTime"];
  updatedAt: Doc<"messages">["updatedAt"];
  isEditing: boolean;
  isCompact?: boolean;
  setEditingId: (id: Id<"messages"> | null) => void;
  hideThreadButton?: boolean;
  threadCount?: number;
  threadImage?: string;
  threadTimestamp?: number;
  handleReaction: (value: string) => void;
  handleDelete: () => void;
  handleThread: () => void;
  onUpdateMessage?: (id: Id<"messages">, body: string) => void;
  isPendingReaction?: boolean;
}

const formatFullTime = (date: Date) => {
  return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMMM d, yyyy")} at ${format(date, "h:mm:ss a")}`;
};

export const Message = ({
  id,
  memberId,
  authorImage,
  authorName = "Member",
  isAuthor,
  reactions,
  body,
  createdAt,
  updatedAt,
  isEditing,
  setEditingId,
  isCompact,
  image,
  hideThreadButton,
  handleReaction,
  handleDelete,
  handleThread,
  onUpdateMessage,
  isPendingReaction = false,
}: MessageProps) => {
  const avatarFallback = authorName.charAt(0).toUpperCase();

  const handleUpdate = ({ body }: { body: string }) => {
    if (onUpdateMessage) {
      onUpdateMessage(id, body);
    }
  };

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // COMPACT MESSAGE (same user, same block)
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (isCompact) {
    return (
      <div id={`message-${id}`} className="group px-4 py-1.5 hover:bg-slate-50/30 dark:hover:bg-zinc-900/30 transition-colors animate-fadeIn relative">
        <div className="flex items-start gap-4">
          {/* Avatar/Time Column */}
          <div className="w-[70px] flex justify-center shrink-0 border-r border-[#E5E7EB] dark:border-zinc-800 min-h-[24px]">
            {/* Timestamp on hover */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Hint label={formatFullTime(new Date(createdAt))}>
                <span className="text-[10px] text-muted-foreground/40 font-medium whitespace-nowrap">
                  {format(new Date(createdAt), "h:mm a")}
                </span>
              </Hint>
            </div>
          </div>

          {/* Body */}
          <div
            className={cn(
              "flex flex-col w-full pb-1 pl-2 transition-all duration-300"
            )}
          >
            {isEditing ? (
              <div className="w-full animate-in fade-in zoom-in-95 duration-300 ease-out py-2 pr-2">
                {/* Premium Floating Card */}
                <div className="relative">
                  {/* Edit Mode Header */}
                  <div className="flex items-center gap-2 mb-3 px-1">
                    <div className="size-1.5 bg-blue-500 rounded-full animate-pulse shadow-sm shadow-blue-500/50" />
                    <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider letter-spacing-wide">
                      Editing message
                    </span>
                  </div>

                  {/* Editor Container with Max-Width */}
                  <div className="w-full max-w-[680px]">
                    <Editor
                      onSubmit={({ body }) => handleUpdate({ body })}
                      onCancel={() => setEditingId(null)}
                      defaultValue={body}
                      disabled={false}
                      variant="update"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in duration-200">
                <MessageActions
                  isAuthor={isAuthor}
                  isPending={false}
                  handleEdit={() => setEditingId(id)}
                  handleThread={handleThread}
                  handleDelete={handleDelete}
                  handleReaction={handleReaction}
                  hideThreadButton={hideThreadButton}
                >
                  <div className="flex flex-col w-full">
                    <div className="text-[14px] leading-relaxed text-[#374151] dark:text-zinc-300 w-fit">
                      <Renderer value={body} />
                    </div>
                    <Thumbnail url={image} />
                    <Reactions
                      reactions={reactions}
                      currentMemberId={memberId}
                      onToggle={handleReaction}
                      isPending={isPendingReaction}
                    />
                  </div>
                </MessageActions>
              </div>
            )}
            {updatedAt && (
              <span className="text-[10px] text-muted-foreground/30 font-medium block italic mt-1">
                (edited)
              </span>
            )}
          </div>


        </div>
      </div>
    );
  }

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // FULL MESSAGE (new author block)
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  return (
    <div id={`message-${id}`} className="group px-4 py-1.5 hover:bg-slate-50/30 dark:hover:bg-zinc-900/30 transition-colors animate-fadeIn relative border-t border-border first:border-none">
      <div className="flex items-start gap-4">
        {/* Avatar/Time Column */}
        <div className="w-[70px] flex flex-col items-center shrink-0 border-r border-[#E5E7EB] dark:border-zinc-800">
          <Avatar className="size-10 rounded-full shrink-0 shadow-sm border border-transparent transition-transform group-hover:scale-105 bg-white dark:bg-black mb-2">
            <AvatarImage
              src={authorImage}
              alt={authorName}
              className="object-cover transition-all duration-300"
            />
            <AvatarFallback className="bg-primary/15 text-primary text-sm font-sans font-semibold">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>

          <span className="text-[10px] text-muted-foreground/40 font-medium tracking-tight whitespace-nowrap">
            {format(new Date(createdAt), "h:mm a")}
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-col w-full overflow-hidden pt-0.5 pl-2">
          {/* Header */}
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[17px] tracking-tight text-[#111827] dark:text-white hover:underline cursor-pointer font-sans font-bold">
              {authorName}
            </span>
          </div>

          {/* Body */}
          <div
            className={cn(
              "flex flex-col w-full transition-all duration-300"
            )}
          >
            {isEditing ? (
              <div className="w-full animate-in fade-in zoom-in-95 duration-300 ease-out py-2 pr-2">
                {/* Premium Floating Card */}
                <div className="relative">
                  {/* Edit Mode Header */}
                  <div className="flex items-center gap-2 mb-3 px-1">
                    <div className="size-1.5 bg-blue-500 rounded-full animate-pulse shadow-sm shadow-blue-500/50" />
                    <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider letter-spacing-wide">
                      Editing message
                    </span>
                  </div>

                  {/* Editor Container with Max-Width */}
                  <div className="w-full max-w-[680px]">
                    <Editor
                      onSubmit={({ body }) => handleUpdate({ body })}
                      onCancel={() => setEditingId(null)}
                      defaultValue={body}
                      disabled={false}
                      variant="update"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in duration-200">
                <MessageActions
                  isAuthor={isAuthor}
                  isPending={false}
                  handleEdit={() => setEditingId(id)}
                  handleThread={handleThread}
                  handleDelete={handleDelete}
                  handleReaction={handleReaction}
                  hideThreadButton={hideThreadButton}
                >
                  <div className="flex flex-col w-full">
                    <div className="leading-relaxed text-[15px] text-[#374151] dark:text-zinc-400 font-sans w-fit">
                      <Renderer value={body} />
                    </div>
                    <Thumbnail url={image} />
                    <Reactions
                      reactions={reactions}
                      currentMemberId={memberId}
                      onToggle={handleReaction}
                      isPending={isPendingReaction}
                    />
                  </div>
                </MessageActions>
              </div>
            )}

            {/* Edited */}
            {updatedAt && (
              <span className="text-[10px] text-muted-foreground/30 font-semibold block italic mt-1">
                (edited)
              </span>
            )}
          </div>


        </div>
      </div>
    </div >
  );
};
