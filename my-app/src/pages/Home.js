"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import HeroSection from "../components/HeroSection";
import Categories from "../components/Categories";
import LatestJobs from "../components/LatestJobs";
import TopFreelancers from "../components/TopFreelancers";
import NigerianCities from "../components/NigerianCities";
import Footer from "../components/Footer";

export default function HomePage() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  // Label mapping for better display names if desired, 
  // currently using your keys: en, pcm, yo, ha, ig
  const languages = ['en', 'pcm', 'yo', 'ha', 'ig'];

  return (
    <div className="flex flex-col min-h-screen relative">
      
      {/* --- FLOATING LANGUAGE PILL (Bottom Right) --- */}
      <div className="fixed bottom-6 right-6 z-100 flex items-center bg-slate-900 text-white p-1.5 rounded-2xl shadow-2xl border border-white/10 group transition-all duration-300 hover:pr-4">
        <div className="w-10 h-10 flex items-center justify-center bg-emerald-600 rounded-xl shadow-lg">
          <Globe size={18} className="animate-pulse-slow" />
        </div>
        
        <div className="flex gap-1 ml-2">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => changeLanguage(lang)}
              className={`px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-tighter transition-all ${
                i18n.language === lang 
                  ? "bg-white text-slate-900 shadow-sm scale-105" 
                  : "text-slate-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      <main className="grow bg-white">
        <HeroSection 
          title={t('hero_title')} 
          subtitle={t('hero_subtitle')} 
        />

        <div className="space-y-20 pb-20">
          <Categories title={t('section_categories')} />
          <LatestJobs title={t('section_latest_jobs')} />
          <TopFreelancers title={t('section_featured')} />
          <NigerianCities title={t('section_cities')} />
        </div>
      </main>

      <Footer />
    </div>
  );
}