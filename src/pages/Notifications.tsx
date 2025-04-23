
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import NotificationsList from "@/components/notifications/NotificationsList";

const Notifications = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-wider text-jarvis-primary jarvis-glow-text">
          Notifications
        </h1>
        <NotificationsList />
      </div>
    </MainLayout>
  );
};

export default Notifications;
