"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Copy,
  Forward,
  MessageSquareReply,
  Pin,
  SquarePen,
  Star,
  Trash,
} from "lucide-react";

interface MessageMenuProps {
  children: React.ReactNode;
}

export const MessageMenu = ({ children }: MessageMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side="bottom"
        alignOffset={0}
        sideOffset={5}
        className="w-[240px] bg-popover/95 dark:bg-popover/95 backdrop-blur-xl border border-border/50 text-popover-foreground rounded-2xl shadow-2xl p-2"
      >
        <div className="px-2 py-1.5 text-[10px] font-bold text-muted-foreground/50 tracking-wider uppercase mb-1">
          Message Actions
        </div>

        <DropdownMenuItem className="cursor-pointer text-popover-foreground/90 hover:text-accent-foreground hover:bg-accent/50 text-[13px] font-medium py-2 px-2 rounded-lg transition-colors group focus:bg-accent/50 focus:text-accent-foreground">
          Edit Message
          <SquarePen className="size-4 ml-auto opacity-50 group-hover:opacity-100 transition-opacity" />
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer text-popover-foreground/90 hover:text-accent-foreground hover:bg-accent/50 text-[13px] font-medium py-2 px-2 rounded-lg transition-colors group focus:bg-accent/50 focus:text-accent-foreground">
          Copy Text
          <Copy className="size-4 ml-auto opacity-50 group-hover:opacity-100 transition-opacity" />
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-border/50 my-1 mx-2" />

        <DropdownMenuItem className="cursor-pointer text-popover-foreground/90 hover:text-accent-foreground hover:bg-accent/50 text-[13px] font-medium py-2 px-2 rounded-lg transition-colors group focus:bg-accent/50 focus:text-accent-foreground">
          Pin to Conversation
          <Pin className="size-4 ml-auto opacity-50 group-hover:opacity-100 transition-opacity" />
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-border/50 my-1 mx-2" />

        <DropdownMenuItem className="cursor-pointer text-popover-foreground/90 hover:text-accent-foreground hover:bg-accent/50 text-[13px] font-medium py-2 px-2 rounded-lg transition-colors group focus:bg-accent/50 focus:text-accent-foreground">
          Reply
          <MessageSquareReply className="size-4 ml-auto opacity-50 group-hover:opacity-100 transition-opacity" />
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer text-popover-foreground/90 hover:text-accent-foreground hover:bg-accent/50 text-[13px] font-medium py-2 px-2 rounded-lg transition-colors group focus:bg-accent/50 focus:text-accent-foreground">
          Forward
          <Forward className="size-4 ml-auto opacity-50 group-hover:opacity-100 transition-opacity" />
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer text-popover-foreground/90 hover:text-accent-foreground hover:bg-accent/50 text-[13px] font-medium py-2 px-2 rounded-lg transition-colors group focus:bg-accent/50 focus:text-accent-foreground">
          Star
          <Star className="size-4 ml-auto opacity-50 group-hover:opacity-100 transition-opacity" />
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-border/50 my-1 mx-2" />

        <DropdownMenuItem className="cursor-pointer text-rose-500 hover:text-rose-600 hover:bg-rose-50/50 dark:hover:bg-rose-900/10 text-[13px] font-medium py-2 px-2 rounded-lg transition-colors group focus:text-rose-600 focus:bg-rose-50/50 dark:focus:bg-rose-900/10">
          Delete for Me
          <Trash className="size-4 ml-auto opacity-50 group-hover:opacity-100 transition-opacity" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
