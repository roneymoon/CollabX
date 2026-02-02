"use client";

import { differenceInMinutes, isSameDay } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import { Message } from "@/components/message";
import { GetMessageReturnType } from "@/features/messages/api/use-get-messages";
import { ChannelHero } from "./channel-hero";
import { useUpdateMessage } from "@/features/messages/api/use-update-message";
import { useRemoveMessage } from "@/features/messages/api/use-remove-message";
import { useToggleReaction } from "@/features/reactions/api/use-toggle-reaction";
import { Id } from "../../convex/_generated/dataModel";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

const TIME_THRESHOLD = 5;

interface MessageListProps {
  memberName?: string;
  memberImage?: string;
  channelName?: string;
  channelCreationTime?: number;
  variant?: "channel" | "thread" | "conversation";
  data: GetMessageReturnType | undefined;
  loadMore: () => void;
  isLoadingMore: boolean;
  canLoadMore: boolean;
}

export const MessageList = ({
  data,
  loadMore,
  isLoadingMore,
  canLoadMore,
  variant,
  channelName,
  channelCreationTime,
}: MessageListProps) => {
  const workspaceId = useWorkspaceId();
  const { data: currentMember } = useCurrentMember({ workspaceId });

  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);
  const [deletingId, setDeletingId] = useState<Id<"messages"> | null>(null);
  const [showNewMessagesBanner, setShowNewMessagesBanner] = useState(false);

  const { mutate: updateMessage, isPending: isUpdating } = useUpdateMessage();
  const { mutate: removeMessage, isPending: isDeleting } = useRemoveMessage();
  const { mutate: toggleReaction, isPending: isTogglingReaction } =
    useToggleReaction();

  const searchParams = useSearchParams();
  const highlightedMessageId = searchParams.get("highlightMessage");
  const hasScrolledRef = useRef(false);

  useEffect(() => {
    if (highlightedMessageId && data && data.length > 0 && !hasScrolledRef.current) {
      const scrollToMessage = () => {
        const element = document.getElementById(`message-${highlightedMessageId}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          element.classList.add("message-highlighted");

          setTimeout(() => {
            element.classList.remove("message-highlighted");
          }, 2500);

          hasScrolledRef.current = true;
        }
      };

      // Small delay to ensure DOM is ready
      const timer = setTimeout(scrollToMessage, 500);
      return () => clearTimeout(timer);
    }
  }, [highlightedMessageId, data]);

  const handleUpdateMessage = (id: Id<"messages">, body: string) => {
    updateMessage(
      { id, body },
      {
        onSuccess: () => {
          toast.success("Message updated");
          setEditingId(null);
        },
        onError: () => {
          toast.error("Failed to update message");
        },
      }
    );
  };

  const handleDeleteMessage = () => {
    if (!deletingId) return;

    removeMessage(
      { id: deletingId },
      {
        onSuccess: () => {
          toast.success("Message deleted");
          setDeletingId(null);
        },
        onError: () => {
          toast.error("Failed to delete message");
        },
      }
    );
  };

  return (
    <>
      <div
        className="flex-1 flex flex-col-reverse overflow-y-auto pb-6 messages-scrollbar scroll-smooth relative"
        onScroll={(e) => {
          const target = e.currentTarget;
          // In flex-col-reverse, scrollTop 0 is the bottom.
          // Scrolling UP results in negative scrollTop.
          if (target.scrollTop < -200) {
            setShowNewMessagesBanner(true);
          } else if (target.scrollTop >= -50) {
            setShowNewMessagesBanner(false);
          }
        }}
      >
        {/* Messages */}
        {data?.map((message, index) => {
          const nextMessage = data[index + 1]; // This is the PREVIOUS message in time

          const isCompact =
            nextMessage &&
            nextMessage.user?._id === message.user?._id &&
            differenceInMinutes(
              new Date(message._creationTime),
              new Date(nextMessage._creationTime),
            ) < TIME_THRESHOLD;

          const isNewDay =
            !nextMessage ||
            !isSameDay(
              new Date(message._creationTime),
              new Date(nextMessage._creationTime),
            );

          return (
            <div key={message._id}>
              {isNewDay && (
                <div className="relative flex items-center justify-center my-6">
                  <div
                    className="absolute inset-0 flex items-center px-4"
                    aria-hidden="true"
                  >
                    <div className="w-full border-t border-black/[0.03] dark:border-white/[0.03]" />
                  </div>
                  <span className="relative z-10 px-4 py-1.5 rounded-full bg-white dark:bg-black border border-black/[0.05] dark:border-white/[0.05] text-[11px] font-semibold text-neutral-500 shadow-sm">
                    {new Date(message._creationTime).toLocaleDateString(undefined, {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              )}
              <Message
                id={message._id}
                memberId={message.memberId}
                authorImage={message.user.image}
                authorName={message.user.name}
                isAuthor={message.memberId === currentMember?._id}
                reactions={message.reactions}
                body={message.body}
                image={message.image}
                isEditing={editingId === message._id}
                setEditingId={setEditingId}
                isCompact={isCompact}
                hideThreadButton={variant === "thread"}
                updatedAt={message.updatedAt}
                createdAt={message._creationTime}
                threadCount={message.threadCount}
                threadImage={message.threadImage}
                threadTimestamp={message.threadTimestamp}
                isPendingReaction={isTogglingReaction}
                handleReaction={(emoji) => {
                  toggleReaction(
                    {
                      messageId: message._id,
                      value: emoji,
                    },
                    {
                      onSuccess: (data) => {
                        toast.success(
                          data?.added
                            ? `Reacted with ${emoji}`
                            : `Removed ${emoji}`
                        );
                      },
                      onError: (error) => {
                        if (error.message.includes("second")) {
                          toast.error(
                            "Slow down! Wait a moment before reacting again."
                          );
                        } else {
                          toast.error("Failed to toggle reaction");
                        }
                      },
                    }
                  );
                }}
                handleThread={() => {
                  // TODO: Implement thread handler
                  console.log("Open thread for:", message._id);
                  toast.info("Thread feature coming soon");
                }}
                handleDelete={() => setDeletingId(message._id)}
                onUpdateMessage={handleUpdateMessage}
              />
            </div>
          );
        })}

        {/* Load More Indicator */}
        <div
          className="h-1"
          ref={(el) => {
            if (el) {
              const observer = new IntersectionObserver(
                ([entry]) => {
                  if (entry.isIntersecting && canLoadMore) {
                    loadMore();
                  }
                },
                { threshold: 1.0 }
              );
              observer.observe(el);
              return () => observer.disconnect();
            }
          }}
        />
        {canLoadMore && (
          <div className="flex flex-col items-center gap-y-2 px-5 py-6">
            {isLoadingMore ? (
              <div className="w-full flex flex-col gap-y-4 max-w-[600px] mx-auto animate-in fade-in duration-500">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="size-10 bg-black/[0.03] dark:bg-white/[0.03] rounded-full shrink-0 flex items-center justify-center">
                      <div className="size-6 bg-black/[0.05] dark:bg-white/[0.05] rounded-full animate-pulse" />
                    </div>
                    <div className="flex flex-col gap-2 w-full pt-1">
                      <div className="h-4 bg-black/[0.03] dark:bg-white/[0.03] rounded w-32 animate-pulse" />
                      <div className="h-3 bg-black/[0.03] dark:bg-white/[0.03] rounded w-[85%] animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="group relative flex items-center justify-center w-full py-2">
                <div className="absolute inset-0 flex items-center px-5" aria-hidden="true">
                  <div className="w-full border-t border-black/[0.03] dark:border-white/[0.03]" />
                </div>
                <button
                  onClick={loadMore}
                  className="relative z-10 px-4 py-1.5 rounded-full bg-white dark:bg-neutral-900 border border-black/[0.05] dark:border-white/[0.05] shadow-sm text-[11px] font-semibold text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  Load older messages
                </button>
              </div>
            )}
          </div>
        )}

        {/* Start of Message History (Hero) */}
        {variant === "channel" &&
          channelName &&
          channelCreationTime &&
          !canLoadMore && (
            <ChannelHero name={channelName} creationTime={channelCreationTime} />
          )}
      </div>

      {/* New Messages Indicator */}
      {showNewMessagesBanner && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <button
            onClick={() => {
              const scrollContainer = document.querySelector(".messages-scrollbar");
              if (scrollContainer) {
                scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
              }
              setShowNewMessagesBanner(false);
            }}
            className="group flex items-center gap-x-2 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border border-neutral-200/50 dark:border-neutral-800/50 px-5 py-2.5 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] text-[13px] font-medium text-neutral-800 dark:text-neutral-200 transition-all hover:bg-white dark:hover:bg-neutral-900 hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] active:scale-95"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
            </span>
            New messages below
            <svg
              className="size-4 text-neutral-400 group-hover:translate-y-0.5 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deletingId !== null}
        onOpenChange={(open) => !open && setDeletingId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete message?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              message.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMessage}
              disabled={isDeleting}
              className="bg-rose-500 hover:bg-rose-600"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
