"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Search, Zap, CheckCircle } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { APP_CATEGORIES } from "../constants/categories";

export default function HeroSection() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleQuickCategory = (categorySlug) => {
    navigate(`/search?category=${categorySlug}`);
  };

  const popularTags = APP_CATEGORIES.slice(0, 4);

  return (
    <div className="relative bg-linear-to-b from-emerald-50/50 to-white px-4 py-20 lg:py-32 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl" />
      </div>
      
      <div className="relative max-w-5xl mx-auto text-center">
        {/* Trust Badge */}
        <div className="inline-flex items-center gap-2 bg-white border border-emerald-100 px-4 py-1.5 rounded-full mb-8 shadow-sm">
          <Zap size={14} className="text-emerald-600 fill-emerald-600" />
          <span className="text-emerald-800 text-[10px] font-black uppercase tracking-widest">
            {t('hero_trust_badge')}
          </span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]">
          {t('hero_main_title_1')} <span className="text-emerald-600">{t('hero_main_title_2')}</span> <br className="hidden md:block" /> {t('hero_main_title_3')}
        </h1>
        
        {/* Subtitle */}
        <p className="text-lg md:text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
          {t('hero_subtitle')}
        </p>
        
        {/* Search Card */}
        <Card className="max-w-3xl mx-auto mb-10 shadow-2xl shadow-emerald-900/10 border-none rounded-[2.5rem] overflow-hidden">
          <CardContent className="p-2 sm:p-4 bg-white">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
                <Input 
                  placeholder={t('hero_input_placeholder')} 
                  className="w-full h-16 pl-16 border-none focus-visible:ring-0 text-xl placeholder:text-slate-400 font-medium" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button 
                type="submit" 
                className="h-16 px-10 bg-slate-900 hover:bg-emerald-600 text-white text-lg font-black rounded-[1.8rem] transition-all duration-300 shadow-lg"
              >
                {t('search')}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Popular Tags */}
        <div className="flex flex-wrap items-center justify-center gap-y-3 gap-x-3 text-sm mb-20">
          <span className="text-slate-500 font-bold uppercase tracking-tighter text-xs mr-2">
            {t('hero_popular_label')}
          </span>
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 border-t border-slate-100 pt-16">
          <StatItem value="50k+" label={t('hero_stat_freelancers')} />
          <StatItem value="100k+" label={t('hero_stat_escrow')} />
          <StatItem value="₦2.5B+" label={t('hero_stat_transacted')} />
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
      <div className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-3 text-center">
        {label}
      </div>
    </div>
  );
}