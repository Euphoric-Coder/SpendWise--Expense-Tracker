"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { db } from "@/utils/dbConfig";
import { Feedback } from "@/utils/schema";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import TestimonialsCarousel from "@/components/Feedback/Testimonials";

const FeedbackForm = () => {
  const { user } = useUser();
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState();
  const [rating, setRating] = useState("");
  const [comments, setComments] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [existingFeedback, setExistingFeedback] = useState(null);
  // Fetch existing feedback if it exists
  const fetchFeedback = async () => {
    if (!user) return;

    const result = await db
      .select()
      .from(Feedback)
      .where(eq(Feedback.createdBy, user.primaryEmailAddress.emailAddress));

    if (result.length > 0) {
      const feedback = result[0];
      setExistingFeedback(feedback);
      setUsername(feedback.username);
      setAvatar(feedback.avatar);
      setRating(feedback.rating);
      setComments(feedback.comments);
    }
  };

  useEffect(() => {
    if (user) {
      setUsername(user.username || user.fullName || "Anonymous");
      setAvatar(user.imageUrl); // Fetch avatar from Clerk
      fetchFeedback();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const feedbackData = {
      username: isAnonymous ? "Anonymous" : username,
      avatar: isAnonymous ? "" : avatar, // Empty avatar if anonymous
      rating: parseInt(rating),
      comments,
      createdBy: user.primaryEmailAddress.emailAddress,
    };

    try {
      if (existingFeedback) {
        // Update feedback if it already exists
        await db
          .update(Feedback)
          .set(feedbackData)
          .where(eq(Feedback.id, existingFeedback.id));
        toast.success("Feedback updated successfully!");
      } else {
        // Insert new feedback
        await db.insert(Feedback).values(feedbackData);
        toast.success("Feedback submitted successfully!");
      }
      fetchFeedback(); // Refresh feedback data
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Error submitting feedback. Please try again.");
    }
  };

  const handleDelete = async () => {
    try {
      await db.delete(Feedback).where(eq(Feedback.id, existingFeedback.id));
      setExistingFeedback(null);
      setRating("");
      setComments("");
      setIsAnonymous(false); // Reset anonymous toggle
      toast.success("Feedback deleted successfully!");
    } catch (error) {
      toast.error("Error deleting feedback");
    }
  };

  return (
    <div>
      {existingFeedback && (
        <div className="text-center text-2xl font-bold text-gray-600 mt-10 animate-pulse">
          Thank you for your feedback!
        </div>
      )}
      <div className="max-w-md mx-auto p-8 border-2 rounded-3xl shadow-lg bg-gradient-to-b from-white via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden transition-all duration-300">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-r from-blue-500 via-teal-400 to-indigo-500 opacity-25 blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-gradient-to-br from-indigo-500 via-purple-400 to-blue-400 opacity-20 blur-[80px]"></div>
          <div className="absolute top-1/2 -left-10 w-96 h-96 bg-gradient-radial from-blue-300 via-transparent to-transparent opacity-20 blur-[120px] transform -translate-y-1/2"></div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-indigo-500 dark:from-blue-400 dark:via-teal-400 dark:to-blue-500 mb-6">
          Feedback Form
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {/* Anonymous Toggle */}
          {/* <div className="flex items-center">
            <input
              type="checkbox"
              id="anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-5 h-5 border border-indigo-300 rounded-md focus:ring focus:ring-indigo-200 dark:focus:ring-indigo-500 text-indigo-500 dark:text-teal-500 transition-all mr-3"
            />
            <label
              htmlFor="anonymous"
              className="text-gray-700 dark:text-gray-300 font-medium"
            >
              Submit Anonymously
            </label>
          </div> */}

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Username
            </label>
            <Input
              type="text"
              value={isAnonymous ? "Anonymous" : username}
              disabled
              className="w-full p-3 border rounded-lg shadow-inner focus:outline-none focus:ring focus:ring-indigo-300 dark:focus:ring-blue-500 transition-all bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-300"
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rating
            </label>
            <Input
              type="number"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              placeholder="Rate from 1 to 5"
              min="1"
              max="5"
              required
              className="w-full p-3 border rounded-lg shadow-inner focus:outline-none focus:ring focus:ring-indigo-300 dark:focus:ring-blue-500 transition-all bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-300"
            />
          </div>

          {/* Comments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Comments
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Enter your comments"
              required
              className="w-full p-3 border rounded-lg shadow-inner focus:outline-none focus:ring focus:ring-indigo-300 dark:focus:ring-blue-500 transition-all bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-300"
            ></textarea>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full py-3 rounded-lg text-white font-bold shadow-lg bg-gradient-to-r from-blue-500 via-teal-500 to-indigo-500 dark:from-blue-600 dark:via-teal-600 dark:to-indigo-700 hover:scale-105 hover:shadow-xl transition-transform duration-300"
          >
            {existingFeedback ? "Update Feedback" : "Submit Feedback"}
          </Button>

          {/* Delete Button */}
          {existingFeedback && (
            <Button
              type="button"
              onClick={handleDelete}
              className="w-full py-3 mt-2 rounded-lg text-white font-bold shadow-lg bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 dark:from-red-600 dark:via-orange-600 dark:to-yellow-600 hover:scale-105 hover:shadow-xl transition-transform duration-300"
            >
              Delete Feedback
            </Button>
          )}
        </form>
      </div>

      <TestimonialsCarousel />
    </div>
  );
};

export default FeedbackForm;
