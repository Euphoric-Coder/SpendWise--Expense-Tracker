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
      <div className="max-w-md mx-auto p-6 border rounded-lg shadow-lg bg-white">
        <h2 className="text-2xl font-bold text-center mb-4">Feedback Form</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="anonymous" className="text-gray-700">
              Submit Anonymously
            </label>
          </div>
          <div>
            <label className="block text-gray-700">Username</label>
            <Input
              type="text"
              value={isAnonymous ? "Anonymous" : username}
              disabled
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-gray-700">Rating</label>
            <Input
              type="number"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              placeholder="Rate from 1 to 5"
              min="1"
              max="5"
              required
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-gray-700">Comments</label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Enter your comments"
              className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:border-blue-300"
            ></textarea>
          </div>
          <Button type="submit" className="w-full bg-blue-500 text-white">
            {existingFeedback ? "Update Feedback" : "Submit Feedback"}
          </Button>
          {existingFeedback && (
            <Button
              type="button"
              onClick={handleDelete}
              className="w-full mt-2 bg-red-500 text-white"
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
