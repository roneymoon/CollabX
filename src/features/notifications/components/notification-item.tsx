"use client";

import { Id } from "@convex/_generated/dataModel";
import { useMarkRead } from "../api/use-mark-read";

type Props = {
  notification: {
    _id: Id<"notifications">;
    type: "mention" | "reply" | "reaction" | "message" | "system";
    isRead: boolean;
    createdAt: number;
  };
};

export const NotificationItem = ({ notification }: Props) => {
  const { mutate } = useMarkRead();

  const handleClick = async () => {
    if (!notification.isRead) {
      await mutate({ id: notification._id });
    }
  };

  const label =
  notification.type === "mention"
    ? "You were mentioned"
    : notification.type === "reply"
    ? "Someone replied to you"
    : notification.type === "reaction"
    ? "Someone reacted to your message"
    : notification.type === "message"
    ? "New message"
    : "System update";

  return (
    <div
      onClick={handleClick}
      className={`p-4 rounded-xl border cursor-pointer transition hover:bg-muted/50 ${
        notification.isRead ? "opacity-60" : "bg-muted/30"
      }`}
    >
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium">{label}</p>
        <span className="text-xs text-muted-foreground">
          {new Date(notification.createdAt).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};
