"use client";

import { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { animate } from "framer-motion";

const NotificationTab = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "Your budget report is ready.",
      read: false,
    },
    {
      id: 2,
      message: "New expense added successfully.",
      read: false,
    },
    {
      id: 3,
      message: "Reminder: Review your subscriptions.",
      read: false,
    },
    {
      id: 4,
      message:
        "Reminder: Your Expense 'Buying Groceries' from budget 'Groceries' is due tomorrow. Please plan accordingly.",
      read: false,
    },
  ]);

  const [currentNotification, setCurrentNotification] = useState(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const interval = setInterval(() => {
      const newNotification = {
        id: Date.now(),
        message: `New update at ${new Date().toLocaleTimeString()}`,
        read: false,
      };
      setNotifications((prev) => [newNotification, ...prev]);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <Popover>
      <PopoverTrigger className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 shadow-md hover:shadow-lg transition-all">
        <Bell
          className="text-gray-700 dark:text-gray-300 w-6 h-6"
          style={{ animation: "wiggle 2s ease-in-out infinite" }}
        />
        {unreadCount > 0 && (
          <div className="absolute right-2 top-2 h-4 w-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs flex items-center justify-center">
            {unreadCount}
          </div>
        )}
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-96 p-4 rounded-lg bg-white dark:bg-gray-900 shadow-xl border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 border-b border-gray-200 dark:border-gray-700 pb-2">
          Notifications
        </h3>
        <div className="mt-3 max-h-80 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-md shadow-sm hover:shadow-md transition ${
                  notification.read
                    ? "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                    : "bg-blue-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                }`}
              >
                <p
                  className={`text-sm ${
                    notification.message.length > 80
                      ? "line-clamp-2"
                      : "line-clamp-none"
                  }`}
                >
                  {notification.message}
                </p>
                <div className="flex justify-between mt-2">
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="xs"
                      className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500"
                      onClick={() => markAsRead(notification.id)}
                    >
                      Mark as Read
                    </Button>
                  )}
                  {notification.message.length > 80 && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="xs"
                          className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500"
                          onClick={() => setCurrentNotification(notification)}
                        >
                          Show More
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="rounded-lg p-6 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-lg">
                        <h4 className="text-lg font-bold mb-2">
                          Notification Details
                        </h4>
                        <p className="text-sm">
                          {currentNotification?.message}
                        </p>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              No new notifications
            </p>
          )}
        </div>
        <div className="flex justify-between mt-4">
          {notifications.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 border-gray-300 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-gray-700"
              onClick={clearNotifications}
            >
              Clear All
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationTab;
