'use client'

import AnimatedScrollDashboardImg from "@/components/AnimatedScrollDashboardImg";
import AppTitle from "@/components/AppTitle";
import CTASection from "@/components/CTA";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import KeyFeatures from "@/components/KeyFeatures";
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
