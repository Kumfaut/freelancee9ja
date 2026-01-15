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
        
        {/* Simple CTA Section */}
        <section className="bg-emerald-900 py-20 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-black mb-6 tracking-tight">
              Ready to build your Nigerian dream?
            </h2>
            <p className="mb-10 text-emerald-100 text-lg max-w-2xl mx-auto">
              Whether you're hiring top talent or looking for your next big gig, 
              NaijaTrust is the bridge that secures every transaction.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/register" 
                className="bg-emerald-500 hover:bg-emerald-400 text-white px-10 py-4 rounded-full font-bold transition-all shadow-lg"
              >
                Get Started for Free
              </a>
              <a 
                href="/jobs" 
                className="bg-transparent border-2 border-emerald-400/30 hover:border-emerald-400 text-white px-10 py-4 rounded-full font-bold transition-all"
              >
                Browse Jobs
              </a>
            </div>
          </div>
        </section>

        {/* Localized Trust Section */}
        <NigerianCities />
      </main>

      <Footer />
    </div>
  );
}