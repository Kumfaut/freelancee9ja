"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchCategoryStats } from "../api/api";
import { SimpleCard, SimpleCardContent } from './SimpleCard';
import { 
  Code, Palette, PenTool, Megaphone, 
  Camera, Music, BarChart3, Smartphone, ArrowRight
} from 'lucide-react';

const CATEGORY_DATA = [
  { id: 'web-development', icon: Code, fallbackCount: 12450, color: 'bg-blue-50 text-blue-600' },
  { id: 'design', icon: Palette, fallbackCount: 8230, color: 'bg-purple-50 text-purple-600' },
  { id: 'writing', icon: PenTool, fallbackCount: 6890, color: 'bg-emerald-50 text-emerald-600' },
  { id: 'marketing', icon: Megaphone, fallbackCount: 5670, color: 'bg-orange-50 text-orange-600' },
  { id: 'photography', icon: Camera, fallbackCount: 4320, color: 'bg-amber-50 text-amber-600' },
  { id: 'audio', icon: Music, fallbackCount: 3450, color: 'bg-pink-50 text-pink-600' },
  { id: 'data', icon: BarChart3, fallbackCount: 2890, color: 'bg-indigo-50 text-indigo-600' },
  { id: 'mobile', icon: Smartphone, fallbackCount: 4560, color: 'bg-teal-50 text-teal-600' }
];

export default function Categories() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [realStats, setRealStats] = useState({});

  useEffect(() => {
    const getStats = async () => {
      try {
        const response = await fetchCategoryStats();
        if (response.data && response.data.data) {
          const statsObj = response.data.data.reduce((acc, curr) => {
            acc[curr.category] = curr.count;
            return acc;
          }, {});
          setRealStats(statsObj);
        }
      } catch (err) {
        console.error("Live stats error:", err);
      }
    };
    getStats();
  }, []);

  const handleCategoryClick = (categoryId) => {
    navigate(`/search?category=${categoryId}`);
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">
            {t('cat_title')}
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto font-medium">
            {t('cat_subtitle')}
          </p>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORY_DATA.map((category) => {
            const IconComponent = category.icon;
            const liveCount = realStats[category.id];
            
            // Format: "X active jobs" or "X services"
            const displayCount = liveCount !== undefined 
              ? `${liveCount.toLocaleString()} ${t('cat_active_jobs')}` 
              : `${category.fallbackCount.toLocaleString()} ${t('cat_services')}`;

            return (
              <SimpleCard 
                key={category.id} 
                onClick={() => handleCategoryClick(category.id)}
                className="group border-none shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 cursor-pointer rounded-3xl bg-slate-50/50"
              >
                <SimpleCardContent className="p-8 text-center">
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl ${category.color} flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm`}>
                    <IconComponent size={32} />
                  </div>
                  <h3 className="font-black text-slate-900 mb-2 uppercase text-xs tracking-widest leading-tight">
                    {t(category.id)}
                  </h3>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">
                    {displayCount}
                  </p>
                </SimpleCardContent>
              </SimpleCard>
            );
          })}
        </div>

        {/* Footer Section */}
        <div className="text-center mt-16">
          <button 
            onClick={() => navigate('/search')}
            className="inline-flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all shadow-lg"
          >
            {t('cat_view_all')} <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}