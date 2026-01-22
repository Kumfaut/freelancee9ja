"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchJobs } from "../api/api";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/Tabs";
import { 
  Search, MapPin, DollarSign, SlidersHorizontal, Check, Clock, X, Loader2, Globe 
} from "lucide-react";
import { toast } from "sonner";
import { APP_CATEGORIES } from "../constants/categories";

const LOCATIONS = ["All", "Lagos", "Abuja", "Port Harcourt", "Ibadan", "Remote"];

export default function SearchPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const queryParam = searchParams.get("search") || "";
  const categoryParam = searchParams.get("category") || "All";
  const locationParam = searchParams.get("location") || "All";

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("jobs");
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState(queryParam);

  const CATEGORY_OPTIONS = [
    { label: t('all_categories', 'All Categories'), value: "All" },
    ...APP_CATEGORIES.map(c => ({ label: c.name, value: c.id }))
  ];

  const getCategoryLabel = (slug) => {
    const cat = APP_CATEGORIES.find(c => c.id === slug);
    return cat ? cat.name : slug;
  };

  const loadJobs = useCallback(async (params) => {
    setLoading(true);
    try {
      const response = await fetchJobs({
        search: params.search || undefined,
        category: params.category !== "All" ? params.category : undefined,
        location: params.location !== "All" ? params.location : undefined,
      });
      setJobs(response.data?.data || []);
    } catch (error) {
      toast.error("Failed to fetch jobs.");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateFilters = useCallback((newFilters) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value === "All" || value === "" || !value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    setSearchParams(params, { replace: true });
  }, [searchParams, setSearchParams]);

  const resetFilters = useCallback(() => {
    setSearchTerm("");
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  // Handle Tab Switch (Link to Freelancers)
  const handleTabChange = (value) => {
    if (value === "freelancers") {
      toast.info(t('freelancer_search_msg'));
      navigate("/freelancers"); // Redirects to your freelancer browse page
    } else {
      setActiveTab(value);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm !== queryParam) {
        updateFilters({ search: searchTerm });
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, queryParam, updateFilters]);

  useEffect(() => {
    loadJobs({ search: queryParam, category: categoryParam, location: locationParam });
  }, [queryParam, categoryParam, locationParam, loadJobs]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Language & Header */}
        <div className="flex justify-end mb-4">
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl shadow-sm border border-slate-100">
                <Globe className="w-4 h-4 text-slate-400" />
                <select 
                    className="text-[10px] font-black uppercase tracking-widest outline-none bg-transparent"
                    value={i18n.language}
                    onChange={(e) => i18n.changeLanguage(e.target.value)}
                >
                    <option value="en">EN</option>
                    <option value="pcm">PCM</option>
                    <option value="ig">IG</option>
                    <option value="yo">YO</option>
                    <option value="ha">HA</option>
                </select>
            </div>
        </div>

        <div className="mb-12 text-center">
          <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight uppercase">{t('find_work_title')}</h1>
          <p className="text-slate-500 mb-8 font-medium">{t('search_subtitle')}</p>
          
          <div className="max-w-2xl mx-auto relative group">
            <div className="relative">
              <Search className={`absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 transition-colors ${loading ? 'text-emerald-500 animate-pulse' : 'text-slate-400'}`} />
              <Input
                placeholder={t('search_placeholder')}
                className="pl-14 pr-12 py-8 text-lg shadow-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-emerald-500 rounded-2xl transition-all bg-white font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button onClick={() => {setSearchTerm(""); updateFilters({search: ""})}} className="absolute right-5 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                  <X size={18} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className={`lg:w-72 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <Card className="border-none shadow-sm p-6 sticky top-8 rounded-[2rem] bg-white ring-1 ring-slate-100">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-black text-slate-900 text-xs uppercase tracking-widest">{t('filters_title')}</h2>
                    {(locationParam !== "All" || categoryParam !== "All" || queryParam !== "") && (
                        <button onClick={resetFilters} className="text-[10px] font-black text-emerald-600 uppercase hover:underline">{t('clear_all')}</button>
                    )}
                </div>

              <div className="space-y-8">
                <div>
                    <h3 className="font-bold text-slate-400 mb-4 flex items-center gap-2 text-[10px] uppercase tracking-widest">
                        <MapPin className="w-3 h-3" /> {t('location_label')}
                    </h3>
                    <div className="space-y-1">
                    {LOCATIONS.map(loc => (
                        <button 
                          key={loc}
                          onClick={() => updateFilters({ location: loc })}
                          className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all flex justify-between items-center ${locationParam === loc ? 'bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-100' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                          {loc}
                          {locationParam === loc && <Check className="w-4 h-4" />}
                        </button>
                    ))}
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                    <h3 className="font-bold text-slate-400 mb-4 flex items-center gap-2 text-[10px] uppercase tracking-widest">
                        <SlidersHorizontal className="w-3 h-3" /> {t('category_label')}
                    </h3>
                    <div className="max-h-[300px] overflow-y-auto pr-2 space-y-1 custom-scrollbar">
                    {CATEGORY_OPTIONS.map(cat => (
                        <button 
                          key={cat.value}
                          onClick={() => updateFilters({ category: cat.value })}
                          className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all flex justify-between items-center ${categoryParam === cat.value ? 'bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-100' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                          <span className="truncate mr-2">{cat.label}</span>
                          {categoryParam === cat.value && <Check className="w-4 h-4 shrink-0" />}
                        </button>
                    ))}
                    </div>
                </div>
              </div>
            </Card>
          </aside>

          <main className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full sm:w-auto">
                <TabsList className="bg-white p-1 h-12 border shadow-sm rounded-xl ring-1 ring-slate-100">
                  <TabsTrigger value="jobs" className="px-8 rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white transition-all font-bold">{t('tab_jobs')}</TabsTrigger>
                  <TabsTrigger value="freelancers" className="px-8 rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white transition-all font-bold">{t('tab_freelancers')}</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{jobs.length} {t('results_found')}</span>
                <Button variant="outline" className="lg:hidden rounded-xl h-12 border-slate-200" onClick={() => setShowFilters(!showFilters)}>
                    <SlidersHorizontal className="w-4 h-4 mr-2" /> {t('filters_title')}
                </Button>
              </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
                    <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
                    <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">{t('searching_market')}</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {jobs.length > 0 ? jobs.map(job => (
                        <Card key={job.id} className="border-none shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group rounded-[2rem] overflow-hidden bg-white ring-1 ring-slate-100">
                            <CardContent className="p-0">
                                <div className="flex">
                                    <div className="w-1.5 bg-emerald-500 group-hover:w-3 transition-all"></div>
                                    <div className="p-8 flex-1 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                        <div className="space-y-4">
                                            <div className="flex flex-wrap gap-2">
                                                <Badge className="bg-emerald-50 text-emerald-700 border-none px-3 py-1 text-[10px] font-black uppercase">
                                                    {getCategoryLabel(job.category)}
                                                </Badge>
                                                <Badge className="bg-slate-50 text-slate-500 border-none px-3 py-1 text-[10px] font-black uppercase">
                                                    {job.experience_level || 'Intermediate'}
                                                </Badge>
                                            </div>
                                            <h3 className="text-2xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors tracking-tight">
                                                {job.title}
                                            </h3>
                                            <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500 font-medium">
                                                <span className="flex items-center gap-1.5 font-bold text-slate-900 bg-slate-50 px-3 py-1 rounded-lg">
                                                    <DollarSign className="w-4 h-4 text-emerald-600" /> 
                                                    ₦{Number(job.budget_min).toLocaleString()} - ₦{Number(job.budget_max).toLocaleString()}
                                                </span>
                                                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400" /> {job.location}</span>
                                                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                    <Clock className="w-3.5 h-3.5" /> {new Date(job.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <Button 
                                            className="bg-slate-900 hover:bg-emerald-600 text-white px-8 h-14 rounded-2xl font-black transition-all shadow-xl active:scale-95 shrink-0"
                                            onClick={() => navigate(`/job/${job.id}`)}
                                        >
                                            {t('view_details')}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )) : (
                        <NoResults t={t} resetFilters={resetFilters} />
                    )}
                </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function NoResults({ t, resetFilters }) {
  return (
    <div className="bg-white rounded-[2.5rem] p-20 text-center border-2 border-dashed border-slate-100">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-10 h-10 text-slate-200" />
        </div>
        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{t('no_results')}</h3>
        <p className="text-slate-400 mt-2 font-medium">{t('adjust_filters')}</p>
        <Button variant="link" onClick={resetFilters} className="mt-6 text-emerald-600 font-black uppercase text-xs tracking-widest">
            {t('clear_all')}
        </Button>
    </div>
  );
}