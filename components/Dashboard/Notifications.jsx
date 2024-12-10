"use client";

import { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Bell } from "lucide-react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

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
        "Reminder: Your Expense 'Buying Groceries' from budget 'Groceries' is due tomorrow. This is a long notification to demonstrate how we handle longer messages in a futuristic and usable UI design.",
      read: false,
    },
  ]);

  const [currentNotification, setCurrentNotification] = useState(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const interval = setInterval(() => {
      const newNotification = {
        id: Date.now(),
        message: `New futuristic update at ${new Date().toLocaleTimeString()}`,
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
      <PopoverTrigger className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 shadow-lg hover:scale-110 transition-transform">
        <Bell className="text-white w-6 h-6 drop-shadow-neon" />
        {unreadCount > 0 && (
          <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-pink-500 border-2 border-white animate-pulse"></div>
        )}
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-96 p-6 rounded-xl bg-opacity-90 backdrop-blur-xl bg-gradient-to-b from-gray-900 to-gray-800 shadow-neon border border-gray-700"
      >
        <h3 className="text-xl font-bold text-white border-b border-gray-700 pb-4">
          Notifications
        </h3>
        <div className="mt-4 max-h-80 overflow-y-auto space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg shadow-inner hover:shadow-lg transition-all ${
                  notification.read
                    ? "bg-gray-700/50 text-gray-400"
                    : "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white"
                }`}
              >
                <p
                  className={`text-sm ${
                    notification.message.length > 100
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
                      className="text-blue-300 hover:text-white hover:underline"
                      onClick={() => markAsRead(notification.id)}
                    >
                      Mark as Read
                    </Button>
                  )}
                  {notification.message.length > 100 && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="xs"
                          className="text-pink-300 hover:text-white hover:underline"
                          onClick={() => setCurrentNotification(notification)}
                        >
                          Show More
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="rounded-lg p-6 bg-gray-900 text-white shadow-lg">
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
            <p className="text-sm text-gray-400 text-center">
              No new notifications
            </p>
          )}
        </div>
        <div className="flex justify-between mt-6">
          {notifications.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="text-blue-300 hover:text-white hover:bg-blue-600"
              onClick={clearNotifications}
            >
              Clear All
            </Button>
          )}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-gray-200"
                  onClick={() => alert("Redirecting to notifications page...")}
                >
                  See All
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-gray-800 text-white text-xs p-2 rounded-lg shadow-md">
                View all notifications
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationTab;
