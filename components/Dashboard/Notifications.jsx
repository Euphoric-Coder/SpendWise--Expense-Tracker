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
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  // Fetch notifications on component mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/notifications");
        const data = await response.json();
        setNotifications(data);
        setUnreadCount(notifications?.filter((n) => !n.read).length);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [notifications]);

  // Filtered and searched notifications
  const filteredNotifications = notifications.filter((notification) => {
    const queryWords = searchQuery.toLowerCase().split(" "); // Split and clean query words
    const matchesSearch = queryWords.every(
      (word) =>
        notification.message.toLowerCase().includes(word) ||
        notification.title.toLowerCase().includes(word)
    );
    const matchesFilter =
      filter === "all" ||
      (filter === "unread" && !notification.read) ||
      (filter === "read" && notification.read);

    return matchesSearch && matchesFilter;
  });

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
      setNotifications([]);
      await fetch("/api/notifications", { method: "DELETE" });
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };

  return (
    <Popover>
      <PopoverTrigger
        className="m-2 relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-950 dark:to-gray-950 shadow-xl hover:shadow-2xl transition-transform transform hover:scale-110 focus:outline-none"
        aria-label="Open notifications"
      >
        <Bell
          className={`text-white dark:text-gray-300 w-8 h-8 ${
            unreadCount > 0 ? "animate-wiggle transition-all duration-1000" : ""
          }`}
        />
        {unreadCount > 0 && (
          <div
            className="absolute left-8 top-2 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500 to-red-500 text-white text-sm font-bold shadow-lg"
            aria-live="polite"
          >
            {unreadCount}
          </div>
        )}
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-full max-h-[800px] max-w-sm md:max-w-3xl p-8 rounded-3xl bg-gradient-to-br from-white/50 to-gray-100/50 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur-md shadow-3xl border border-gray-200 dark:border-gray-700 overflow-y-scroll"
        aria-labelledby="notification-header"
      >
        <div className="flex flex-col md:flex-row justify-center md:justify-between items-center mb-6">
          <h3
            id="notification-header"
            className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"
          >
            Notifications
          </h3>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
            <Button
              variant="outline"
              size="md"
              className="px-8 py-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-red-500"
              onClick={() => {
                if (
                  confirm("Are you sure you want to clear all notifications?")
                ) {
                  clearNotifications();
                }
              }}
            >
              Clear All
            </Button>
          </div>
        </div>
        <div
          className={`${
            filteredNotifications.length === 0 && "hidden"
          } space-y-8`}
        >
          <div>
            {/* Unread Notifications */}
            <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
              {filteredNotifications.filter((n) => !n.read).length > 0 &&
                `Unread Notifications (${
                  filteredNotifications.filter((n) => !n.read).length})`}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotifications
                .filter((n) => !n.read)
                .map((notification) => (
                  <div
                    key={notification.id}
                    className="p-6 rounded-3xl bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700 shadow-lg transition-transform transform hover:scale-105"
                  >
                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {notification.title}
                    </h3>
                    {/* Message */}
                    <p className="mt-2 text-base text-gray-800 dark:text-gray-200">
                      {notification.message}
                    </p>
                    {/* Actions */}
                    <div className="flex justify-end mt-4 space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"
                        onClick={() => markAsRead(notification.id)}
                      >
                        Mark as Read
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div>
            {/* Read Notifications */}
            <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
              {filteredNotifications.filter((n) => n.read).length > 0 &&
                `Read Notifications (${
                  filteredNotifications.filter((n) => n.read).length
                })`}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotifications
                .filter((n) => n.read)
                .map((notification) => (
                  <div
                    key={notification.id}
                    className="p-6 rounded-3xl bg-gray-100 dark:bg-gray-800 shadow-lg transition-transform transform hover:scale-105"
                  >
                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300">
                      {notification.title}
                    </h3>
                    {/* Message */}
                    <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
                      {notification.message}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div
          className={`${
            filteredNotifications.length === 0 ? "block" : "hidden"
          } space-y-8`}
        >
          <h4 className="text-xl text-center font-bold text-gray-800 dark:text-gray-200">
            No Search Results found for "{searchQuery}"
          </h4>
        </div>
        {notifications.length > 0 ? (
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              size="md"
              className="px-8 py-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-red-500"
              onClick={() => {
                if (
                  confirm("Are you sure you want to clear all notifications?")
                ) {
                  clearNotifications();
                }
              }}
            >
              Clear All
            </Button>
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-8">
            You have no notifications.
          </p>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationTab;
