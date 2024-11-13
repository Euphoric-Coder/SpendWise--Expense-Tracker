"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@clerk/nextjs";
import Autoplay from "embla-carousel-autoplay";
import { db } from "@/utils/dbConfig";
import { Feedback } from "@/utils/schema";
import { eq } from "drizzle-orm";

// Star component to display rating stars
const StarRating = ({ rating }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, index) => (
        <span
          key={index}
          className={index < rating ? "text-yellow-400" : "text-gray-300"}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const TestimonialsCarousel = () => {
  const [testimonials, setTestimonials] = useState([]);

  // Fetch testimonials from the database
  const fetchTestimonials = async () => {
    try {
      const result = await db
        .select({
          name: Feedback.username,
          image: Feedback.avatar,
          content: Feedback.comments,
          rating: Feedback.rating,
        })
        .from(Feedback);

      // Map the results to ensure all fields are set correctly
      const formattedTestimonials = result.map((feedback) => ({
        name: feedback.name || "Anonymous",
        image: feedback.image || "A", // Fallback image
        content: feedback.content || "No feedback provided",
        rating: feedback.rating || 0,
      }));

      setTestimonials(formattedTestimonials);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  return (
    <Carousel
      plugins={[
        Autoplay({
          delay: 5000,
        }),
      ]}
      className="w-full mx-auto"
    >
      <CarouselContent>
        {testimonials.map((testimonial, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
            <Card className="h-full">
              <CardContent className="flex flex-col justify-between h-full p-6">
                <p className="text-gray-600 mb-4">
                  &quot;{testimonial.content}&quot;
                </p>
                <div className="flex items-center mt-4">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage
                      src={testimonial.image}
                      alt={testimonial.name}
                    />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <StarRating rating={testimonial.rating} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default TestimonialsCarousel;
