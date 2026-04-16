"use client";

import { useGetNotifications } from "../api/use-get-notifications";
import { useMarkAllRead } from "../api/use-mark-all-read";
import { NotificationItem } from "./notification-item";

export const NotificationsList = () => {
  const { data, isPending } = useGetNotifications();
  const { mutate: markAll } = useMarkAllRead();

  if (isPending) {
    return <p className="text-sm text-muted-foreground">Loading...</p>;
  }

  if (!data || data.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No notifications yet
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button
          onClick={() => markAll({})}
          className="text-xs px-3 py-1.5 rounded-lg border hover:bg-muted"
        >
          Mark all read
        </button>
      </div>

      {data.map((n) => (
        <NotificationItem key={n._id} notification={n} />
      ))}
    </div>
  );
};
