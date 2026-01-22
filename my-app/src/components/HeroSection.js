"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Zap, CheckCircle } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { APP_CATEGORIES } from "../constants/categories";

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Direct keyword search
      navigate(`/search?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Maps the "Popular" button to a category slug for perfect filtering
  const handleQuickCategory = (categorySlug) => {
    navigate(`/search?category=${categorySlug}`);
  };

  // Quick list of popular categories to show as tags
  // We take the first 4 from our APP_CATEGORIES constant
  const popularTags = APP_CATEGORIES.slice(0, 4);

  return (
    <div className="relative bg-gradient-to-b from-emerald-50/50 to-white px-4 py-20 lg:py-32 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-5xl mx-auto text-center">
        {/* Trust Badge */}
        <div className="inline-flex items-center gap-2 bg-white border border-emerald-100 px-4 py-1.5 rounded-full mb-8 shadow-sm">
          <Zap size={14} className="text-emerald-600 fill-emerald-600" />
          <span className="text-emerald-800 text-[10px] font-black uppercase tracking-widest">
            Nigeria's #1 Secure Freelance Bridge
          </span>
        </div>

        <h1 className="text-4xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]">
          Find the Best <span className="text-emerald-600">Nigerian Talent</span> <br className="hidden md:block" /> for Your Projects
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
          Connect with vetted professionals from Lagos to Abuja. 
          Secure payments, escrow protection, and world-class results.
        </p>
        
        {/* Main Search Bar Card */}
        <Card className="max-w-3xl mx-auto mb-10 shadow-2xl shadow-emerald-900/10 border-none rounded-[2.5rem] overflow-hidden">
          <CardContent className="p-2 sm:p-4 bg-white">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
                <Input 
                  placeholder="What service do you need today?" 
                  className="w-full h-16 pl-16 border-none focus-visible:ring-0 text-xl placeholder:text-slate-400 font-medium" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button 
                type="submit" 
                className="h-16 px-10 bg-slate-900 hover:bg-emerald-600 text-white text-lg font-black rounded-[1.8rem] transition-all duration-300 shadow-lg"
              >
                Search
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Updated Quick Links using Slugs */}
        <div className="flex flex-wrap items-center justify-center gap-y-3 gap-x-3 text-sm mb-20">
          <span className="text-slate-500 font-bold uppercase tracking-tighter text-xs mr-2">Popular:</span>
          {popularTags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => handleQuickCategory(tag.id)}
              className="px-5 py-2 bg-white border border-slate-200 rounded-full text-slate-700 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50/50 transition-all font-bold shadow-sm"
            >
              {tag.name}
            </button>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 border-t border-slate-100 pt-16">
          <StatItem value="50k+" label="Vetted Freelancers" />
          <StatItem value="100k+" label="Escrow Protections" />
          <StatItem value="₦2.5B+" label="Securely Transacted" />
        </div>
      </div>
    </div>
  );
}

function StatItem({ value, label }) {
  return (
    <div className="flex flex-col items-center group">
      <div className="flex items-center gap-2 text-4xl font-black text-slate-900 group-hover:scale-110 transition-transform">
        {value}
        <CheckCircle size={22} className="text-emerald-500 fill-emerald-50" />
      </div>
      <div className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-3">
        {label}
      </div>
    </div>
  );
}