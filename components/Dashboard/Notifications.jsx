"use client";

import { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotificationTab = () => {
  const [notifications, setNotifications] = useState([]);
  const [currentNotification, setCurrentNotification] = useState(null);

  // Fetch notifications on component mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/notifications");
        const data = await response.json();
        console.log(data)
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Mark a notification as read
  const markAsRead = async (id) => {
    try {
      console.log("Marking notification as read:", id);

      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, read: true }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error Response:", errorData.error);
        return;
      }

      console.log("Notification marked as read successfully");

      // Update state
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error.message);
    }
  };



  // Clear all notifications
  const clearNotifications = async () => {
    try {
      await fetch("/api/notifications", { method: "DELETE" });
      setNotifications([]);
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };

  return (
    <Popover>
      <PopoverTrigger className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-800 dark:to-gray-700 shadow-xl hover:shadow-2xl transition-transform transform hover:scale-110">
        <Bell
          className={`text-gray-700 dark:text-gray-300 w-8 h-8 ${
            unreadCount > 0 ? "animate-pulse" : ""
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
        className="w-[32rem] p-8 rounded-3xl bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 shadow-3xl border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 border-b border-gray-300 dark:border-gray-600 pb-4">
          Notifications
        </h3>
        <div className="mt-6 max-h-[28rem] overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-5 rounded-2xl shadow-lg ${
                  notification.read
                    ? "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                    : "bg-gradient-to-r from-blue-100 via-purple-100 to-blue-50 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 text-gray-800 dark:text-gray-200"
                }`}
              >
                <p className="text-base">{notification.message}</p>
                <div className="flex justify-end mt-4">
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
                      onClick={() => markAsRead(notification.id)}
                    >
                      Mark as Read
                    </Button>
                  )}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
                        onClick={() => setCurrentNotification(notification)}
                      >
                        Show More
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-xl p-6 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-2xl">
                      <h4 className="text-xl font-bold mb-3">
                        Notification Details
                      </h4>
                      <p className="text-base">
                        {currentNotification?.message}
                      </p>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))
          ) : (
            <p className="text-base text-gray-500 dark:text-gray-400 text-center">
              No new notifications
            </p>
          )}
        </div>
        <div className="flex justify-between mt-8">
          {notifications.length > 0 && (
            <Button
              variant="outline"
              size="md"
              className="px-8 py-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
              onClick={clearNotifications}
            >
              Clear All
            </Button>
          )}
          <Button
            variant="ghost"
            size="md"
            className="px-8 py-2 text-gray-600 dark:text-gray-300"
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
