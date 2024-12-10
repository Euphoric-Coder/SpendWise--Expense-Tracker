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
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

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
        "Reminder: Your Expense 'Buying Groceries' from budget 'Groceries' is due tomorrow. This long message showcases how futuristic notifications look elegant with vibrant colors and readability.",
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
      <PopoverTrigger className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 shadow-deep-glow hover:scale-110 transition-transform">
        <Bell className="text-white w-8 h-8 drop-shadow-glow animate-neon-pulse" />
        {unreadCount > 0 && (
          <div className="absolute right-2 top-2 h-5 w-5 rounded-full bg-yellow-500 border-2 border-white animate-pulse"></div>
        )}
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-[28rem] p-6 rounded-2xl bg-opacity-90 backdrop-blur-md bg-gradient-to-b from-gray-900 via-gray-800 to-black shadow-bright-glow border border-gray-700"
      >
        <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500 tracking-wider border-b border-gray-700 pb-4">
          Notifications
        </h3>
        <div className="mt-4 max-h-96 overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-5 rounded-lg transform-gpu hover:scale-105 shadow-card-glow transition-all ${
                  notification.read
                    ? "bg-gray-800/70 text-gray-400"
                    : "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white"
                }`}
              >
                <p
                  className={`text-base ${
                    notification.message.length > 80
                      ? "line-clamp-2"
                      : "line-clamp-none"
                  }`}
                >
                  {notification.message}
                </p>
                <div className="flex justify-between items-center mt-4">
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
                  {notification.message.length > 80 && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="xs"
                          className="text-yellow-300 hover:text-white hover:underline"
                          onClick={() => setCurrentNotification(notification)}
                        >
                          Show More
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="rounded-xl p-8 bg-black text-white shadow-lg">
                        <h4 className="text-lg font-extrabold mb-4">
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
            <p className="text-base text-gray-400 text-center">
              No new notifications
            </p>
          )}
        </div>
        <div className="flex justify-between mt-8">
          {notifications.length > 0 && (
            <Button
              variant="outline"
              size="md"
              className="px-6 text-pink-500 hover:text-white hover:bg-pink-600"
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
                  size="md"
                  className="px-6 text-yellow-400 hover:text-yellow-200"
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
