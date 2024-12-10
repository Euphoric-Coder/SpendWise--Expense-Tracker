"use client";

import { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

const NotificationTab = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Your budget report is ready.", read: false },
    { id: 2, message: "New expense added successfully.", read: false },
    { id: 3, message: "Reminder: Review your subscriptions.", read: false },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const interval = setInterval(() => {
      const newNotification = {
        id: Date.now(),
        message: `New notification at ${new Date().toLocaleTimeString()}`,
        read: false,
      };
      setNotifications((prev) => [newNotification, ...prev]);
    }, 10000); // Add a new notification every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  return (
    <Popover>
      <PopoverTrigger className="relative flex h-10 w-10 items-center justify-center rounded-lg">
        <Bell
        //   width={24}
        //   height={24}
        />
        {unreadCount > 0 && (
          <div className="absolute right-2 top-2 z-20 h-2 w-2 rounded-full bg-blue-500"></div>
        )}
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-72 p-4 shadow-lg rounded-lg bg-white"
      >
        <h3 className="text-sm font-bold text-gray-800">Notifications</h3>
        <div className="mt-2 max-h-60 overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-center justify-between p-2 rounded-md ${
                  notification.read ? "bg-gray-100" : "bg-blue-50"
                } hover:bg-gray-200 transition`}
              >
                <span className="text-sm text-gray-700">
                  {notification.message}
                </span>
                {!notification.read && (
                  <Button
                    variant="ghost"
                    size="xs"
                    className="text-blue-500"
                    onClick={() => markAsRead(notification.id)}
                  >
                    Mark as Read
                  </Button>
                )}
              </div>
            ))
          ) : (
            <p className="py-2 text-center text-gray-500">
              No new notifications
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationTab;
