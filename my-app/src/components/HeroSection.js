"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 Changed this
import { Search, Zap, CheckCircle } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate(); // 👈 Changed this

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // This pushes "?search=something" to the URL
      navigate(`/search?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const quickSearch = (term) => {
    // Change /jobs to /search to match your page route
    navigate(`/search?search=${encodeURIComponent(term)}`);
  };

  return (
    <div className="relative bg-gradient-to-b from-sky-50 to-white px-4 py-20 lg:py-32 overflow-hidden">
      {/* ... (rest of the decorative background remains the same) ... */}
      
      <div className="relative max-w-5xl mx-auto text-center">
        {/* Trust Badge */}
        <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-4 py-1.5 rounded-full mb-6">
          <Zap size={14} className="text-emerald-600 fill-emerald-600" />
          <span className="text-emerald-800 text-xs font-bold uppercase tracking-wider">
            Nigeria's #1 Secure Freelance Bridge
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
          Find the Best <span className="text-emerald-600">Nigerian Talent</span> <br className="hidden md:block" /> for Your Projects
        </h1>
        
        <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Connect with vetted professionals from Lagos to Abuja. 
          Secure payments, escrow protection, and world-class results.
        </p>
        
        <Card className="max-w-2xl mx-auto mb-12 shadow-2xl shadow-emerald-900/10 border-none">
          <CardContent className="p-2 sm:p-3">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <Input 
                  placeholder="What service do you need today?" 
                  className="w-full h-14 pl-12 border-none focus-visible:ring-0 text-lg" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit" className="h-14 px-8 bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-bold rounded-xl transition-all">
                Search
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-4 text-sm mb-16">
          <span className="text-slate-500 font-medium">Popular:</span>
          {["Web Development", "Graphic Design", "Content Writing", "Virtual Assistant"].map((tag) => (
            <button
              key={tag}
              type="button" // 👈 Explicitly set type button to avoid form submission
              onClick={() => quickSearch(tag)}
              className="px-4 py-1.5 bg-white border border-slate-200 rounded-full text-slate-600 hover:border-emerald-500 hover:text-emerald-600 transition-all font-medium shadow-sm"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 border-t border-slate-100 pt-12">
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
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-1 text-3xl font-black text-slate-800">
        {value}
        <CheckCircle size={18} className="text-emerald-500" />
      </div>
      <div className="text-slate-500 text-sm font-medium uppercase tracking-wide mt-1">
        {label}
      </div>
    </div>
  );
}