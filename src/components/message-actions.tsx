"use client";

import { Smile, MessageSquareText, Pencil, Trash2 } from "lucide-react";
import { EmojiPopover } from "./emoji-popover";
import { Hint } from "./hints";
import { Button } from "./ui/button";

interface MessageActionsProps {
  children: React.ReactNode;
  isAuthor: boolean;
  isPending: boolean;
  handleEdit: () => void;
  handleThread: () => void;
  handleDelete: () => void;
  handleReaction: (value: string) => void;
  hideThreadButton?: boolean;
}

export const MessageActions = ({
  children,
  isAuthor,
  isPending,
  handleEdit,
  handleThread,
  handleDelete,
  handleReaction,
  hideThreadButton,
}: MessageActionsProps) => {
  return (
    <div className="relative group/message">
      {children}

      {/* Hover Action Buttons */}
      <div className="absolute -top-4 right-4 z-10 opacity-0 group-hover/message:opacity-100 transition-all duration-200 ease-out transform translate-y-1 group-hover/message:translate-y-0">
        <div className="flex items-center gap-0.5 bg-white dark:bg-zinc-900 border border-border shadow-lg rounded-lg p-1">
          {/* Add Reaction */}
          <EmojiPopover
            hint="Add reaction"
            onEmojiSelect={handleReaction}
          >
            <Button
              variant="ghost"
              size="iconSm"
              disabled={isPending}
            >
              <Smile className="size-4" />
            </Button>
          </EmojiPopover>

          {/* Reply in thread */}
          {!hideThreadButton && (
            <Hint label="Reply in thread">
              <Button
                variant="ghost"
                size="iconSm"
                disabled={isPending}
                onClick={handleThread}
              >
                <MessageSquareText className="size-4" />
              </Button>
            </Hint>
          )}

          {/* Edit & Delete - only for message author */}
          {isAuthor && (
            <>
              <Hint label="Edit message">
                <Button
                  variant="ghost"
                  size="iconSm"
                  disabled={isPending}
                  onClick={handleEdit}
                >
                  <Pencil className="size-4" />
                </Button>
              </Hint>

              <Hint label="Delete message">
                <Button
                  variant="ghost"
                  size="iconSm"
                  disabled={isPending}
                  onClick={handleDelete}
                >
                  <Trash2 className="size-4 text-rose-500" />
                </Button>
              </Hint>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
