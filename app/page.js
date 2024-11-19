"use client";

import AnimatedScrollDashboardImg from "@/components/Homepage/AnimatedScrollDashboardImg";
import AppTitle from "@/components/Homepage/AppTitle";
import CTASection from "@/components/Homepage/CTA";
import Header from "@/components/Homepage/Header";
import Hero from "@/components/Homepage/Hero";
import HowItWorks from "@/components/Homepage/HowItWorks";
import KeyFeatures from "@/components/Homepage/KeyFeatures";
import React from "react";

const page = () => {
  return (
    <div>
      <Header />
      <main className="mt-20">
        <AppTitle />
        <Hero />
        <AnimatedScrollDashboardImg />
        <KeyFeatures />
        <HowItWorks />
        <CTASection />
      </main>
    </div>
  );
};

export default page;
