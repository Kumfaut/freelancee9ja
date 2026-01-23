"use client";

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { Card, CardContent } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { Star, ArrowRight  } from "lucide-react";

export default function TopFreelancers() {
  const { t } = useTranslation();
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopFreelancers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users/freelancers/top");
        const data = response.data.success ? response.data.data : response.data;
        setFreelancers(data || []);
      } catch (error) {
        console.error("Error fetching freelancers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopFreelancers();
  }, []);

  const getInitials = (name) => {
    return name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "??";
  };

  if (loading) {
    return (
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-4 w-32 bg-slate-100 rounded-full mb-4"></div>
            <div className="h-8 w-64 bg-slate-100 rounded-xl mb-12"></div>
            <div className="grid md:grid-cols-2 gap-6 w-full max-w-2xl">
              <div className="h-48 bg-slate-50 rounded-[2.5rem]"></div>
              <div className="h-48 bg-slate-50 rounded-[2.5rem]"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-24 bg-white border-t border-slate-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            {t('top_free_title')}
          </h2>
          <p className="text-slate-500 mt-2 font-medium">
            {t('top_free_subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {freelancers.map((freelancer) => (
            <Card key={freelancer.id} className="border-none shadow-sm bg-slate-50/50 rounded-[2.5rem] hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  {/* Avatar Circle */}
                  <div className="w-16 h-16 bg-white border-4 border-white shadow-sm rounded-2xl flex items-center justify-center text-emerald-600 font-black mr-4 overflow-hidden">
                    {freelancer.profile_image ? (
                      <img src={freelancer.profile_image} alt={freelancer.full_name} className="object-cover w-full h-full" />
                    ) : (
                      <span className="text-xl">{getInitials(freelancer.full_name)}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-slate-900 truncate uppercase text-sm tracking-tight">
                      {freelancer.full_name}
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
                      {freelancer.title || t('top_free_fallback_title')}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star size={12} className="text-amber-400 fill-amber-400" />
                      <span className="text-[10px] font-black text-slate-900">5.0</span>
                      <span className="text-[10px] font-bold text-slate-400 italic">({t('top_free_new')})</span>
                    </div>
                  </div>
                </div>
                
                {/* Skills/Bio Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {(freelancer.bio?.split(",").slice(0, 2) || ["Expert"]).map((skill, i) => (
                    <Badge key={i} className="bg-white text-slate-600 border-none shadow-sm font-black text-[9px] uppercase tracking-tighter px-3 py-1.5 rounded-lg">
                      {skill.trim()}
                    </Badge>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-100/50">
                  <div className="flex flex-col">
                    <span className="text-emerald-600 font-black text-lg tracking-tighter">
                      ₦{Number(freelancer.hourlyRate || 0).toLocaleString()}
                    </span>
                    <span className="text-slate-400 font-black text-[8px] uppercase tracking-widest">
                      / {t('top_free_hour')}
                    </span>
                  </div>
                  <Link to={`/profile/${freelancer.id || freelancer.user_id}`}>
                    <Button size="sm" className="bg-slate-900 hover:bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl px-6 py-5 shadow-lg shadow-slate-200">
                      {t('top_free_contact')}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link to="/browse-freelancers">
            <Button variant="outline" className="border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white font-black text-[10px] uppercase tracking-widest rounded-2xl px-10 h-14 transition-all">
              {t('top_free_browse')} <ArrowRight size={14} className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}