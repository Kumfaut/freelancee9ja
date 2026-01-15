"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCategoryStats } from "../api/api";
import { SimpleCard, SimpleCardContent } from './SimpleCard';
import { 
  Code, Palette, PenTool, Megaphone, 
  Camera, Music, BarChart3, Smartphone 
} from 'lucide-react';

const CATEGORY_DATA = [
  { icon: Code, name: 'Web Development', count: '12,450 services', color: 'bg-blue-100 text-blue-600' },
  { icon: Palette, name: 'Graphic Design', count: '8,230 services', color: 'bg-purple-100 text-purple-600' },
  { icon: PenTool, name: 'Content Writing', count: '6,890 services', color: 'bg-green-100 text-green-600' },
  { icon: Megaphone, name: 'Digital Marketing', count: '5,670 services', color: 'bg-red-100 text-red-600' },
  { icon: Camera, name: 'Photography', count: '4,320 services', color: 'bg-yellow-100 text-yellow-600' },
  { icon: Music, name: 'Audio & Music', count: '3,450 services', color: 'bg-pink-100 text-pink-600' },
  { icon: BarChart3, name: 'Data Analysis', count: '2,890 services', color: 'bg-indigo-100 text-indigo-600' },
  { icon: Smartphone, name: 'Mobile Apps', count: '4,560 services', color: 'bg-teal-100 text-teal-600' }
];

export default function Categories() {
  const navigate = useNavigate();
  const [realStats, setRealStats] = useState({});

  // Fetch real counts from backend
  useEffect(() => {
    const getStats = async () => {
      try {
        const response = await fetchCategoryStats();
        const statsObj = response.data.data.reduce((acc, curr) => {
          acc[curr.category] = curr.count;
          return acc;
        }, {});
        setRealStats(statsObj);
      } catch (err) {
        console.log("Using fallback category counts");
      }
    };
    getStats();
  }, []);

  const handleCategoryClick = (categoryName) => {
    const params = new URLSearchParams();
    params.set("category", categoryName);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header Section - Kept exactly as your design */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Explore Popular Categories
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find the perfect freelancer for your project across various skill categories
          </p>
        </div>

        {/* Grid Section - 1 col mobile, 4 col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {CATEGORY_DATA.map((category, index) => {
            const IconComponent = category.icon;
            // Use real count from DB if available, else use fallback string
            const displayCount = realStats[category.name] 
              ? `${realStats[category.name]} active jobs` 
              : category.count;

            return (
              <SimpleCard 
                key={index} 
                onClick={() => handleCategoryClick(category.name)}
                className="hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <SimpleCardContent className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-xl ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-500">{displayCount}</p>
                </SimpleCardContent>
              </SimpleCard>
            );
          })}
        </div>

        {/* Footer Section */}
        <div className="text-center mt-12">
          <button 
            onClick={() => navigate('/search')}
            className="text-green-600 hover:text-green-700 font-semibold flex items-center gap-2 mx-auto"
          >
            View All Categories →
          </button>
        </div>
      </div>
    </section>
  );
}