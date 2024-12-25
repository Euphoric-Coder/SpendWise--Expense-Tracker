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
      <PopoverTrigger className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-800 dark:to-gray-700 shadow-lg hover:shadow-xl transition-transform transform hover:scale-110">
        <Bell
          className={`text-gray-700 dark:text-gray-300 w-8 h-8 ${
            unreadCount > 0 ? "animate-wiggle" : ""
          }`}
        />
        {unreadCount > 0 && (
          <div className="absolute left-8 top-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-bold shadow-lg">
            {unreadCount}
          </div>
        )}
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-[30rem] p-6 rounded-2xl bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105"
      >
        <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 border-b border-gray-300 dark:border-gray-600 pb-3">
          Notifications
        </h3>
        <div className="mt-5 max-h-96 overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-5 rounded-lg transition-all shadow-md hover:shadow-lg hover:scale-105 ${
                  notification.read
                    ? "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                    : "bg-gradient-to-r from-blue-100 via-purple-100 to-blue-50 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 text-gray-800 dark:text-gray-200 backdrop-blur-lg bg-opacity-90"
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
                <div className="flex justify-between mt-4">
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="xs"
                      className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600"
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
                          className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600"
                          onClick={() => setCurrentNotification(notification)}
                        >
                          Show More
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="rounded-lg p-6 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-xl">
                        <h4 className="text-lg font-bold mb-3">
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
        <div className="flex justify-between mt-6">
          {notifications.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="px-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 border-gray-300 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-gray-700"
              onClick={clearNotifications}
            >
              Clear All
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="px-6 text-gray-600 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-400"
            onClick={() => alert("Redirecting to notifications page...")}
          >
            See All
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationTab;
