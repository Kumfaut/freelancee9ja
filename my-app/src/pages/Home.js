"use client";

import React from "react";
import HeroSection from "../components/HeroSection";
import Categories from "../components/Categories";
import LatestJobs from "../components/LatestJobs";
import TopFreelancers from "../components/TopFreelancers";
import NigerianCities from "../components/NigerianCities";
import Footer from "../components/Footer";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow bg-white">
        {/* Main Brand Hero */}
        <HeroSection />

        {/* Core Discovery Sections */}
        <Categories />
        <LatestJobs />
        <TopFreelancers />
        
        {/* Localized Trust Section */}
        <NigerianCities />
      </main>

      <Footer />
    </div>
  );
}