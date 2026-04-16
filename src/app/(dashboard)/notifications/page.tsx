"use client";

import { NotificationsList } from "@/features/notifications/components/notifications-list";

const NotificationsPage = () => {
  return (
    <div className="h-full p-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">Notifications</h1>
      <NotificationsList />
    </div>
  );
};

export default NotificationsPage;