"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "./ui/Card";
import { MapPin } from "lucide-react";

// Use translation keys instead of hardcoded names
const cityKeys = [
  "city_lagos", 
  "city_abuja", 
  "city_ph", 
  "city_kano", 
  "city_ibadan", 
  "city_enugu"
];

export default function NigerianCities() {
  const { t } = useTranslation();

  return (
    <section className="bg-white px-4 py-20">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-slate-900 text-white border-0 rounded-[3rem] overflow-hidden shadow-2xl shadow-emerald-900/20">
          <CardContent className="p-10 md:p-16">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                <MapPin className="text-emerald-400" size={24} />
              </div>
              
              <h3 className="text-center mb-10 font-black text-xl md:text-2xl tracking-tight uppercase italic">
                {t('cities_heading')}
              </h3>
              
              <div className="flex justify-center flex-wrap gap-x-8 gap-y-4">
                {cityKeys.map((key, index) => (
                  <div key={index} className="flex items-center gap-2 group cursor-default">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full group-hover:scale-150 transition-transform" />
                    <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-white transition-colors">
                      {t(key)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}