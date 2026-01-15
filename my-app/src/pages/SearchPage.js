"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchJobs } from "../api/api";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/Tabs";
// import { Avatar, AvatarFallback } from "../components/ui/Avatar";
import { 
  Search, MapPin, DollarSign, SlidersHorizontal, Check, Clock, X, Loader2 
} from "lucide-react";
import { toast } from "sonner";

const LOCATIONS = ["All", "Lagos", "Abuja", "Port Harcourt", "Ibadan", "Remote"];
const CATEGORIES = ["All", "Web Development", "UI/UX Design", "Content Writing", "Marketing"];

export default function SearchPage() {
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

  // --- 1. DATA FETCHING ---
  const loadJobs = useCallback(async (params) => {
    setLoading(true);
    try {
      const response = await fetchJobs({
        search: params.search !== "" ? params.search : undefined,
        category: params.category !== "All" ? params.category : undefined,
        location: params.location !== "All" ? params.location : undefined,
      });
      setJobs(response.data?.data || []);
    } catch (error) {
      toast.error("Failed to fetch jobs.");
      console.error("SEARCH_ERROR:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // --- 2. FILTER & URL LOGIC ---
  const updateFilters = useCallback((newFilters) => {
    const current = Object.fromEntries(searchParams.entries());
    const merged = { ...current, ...newFilters };
    
    if (merged.category === "All") delete merged.category;
    if (merged.location === "All") delete merged.location;
    if (!merged.search) delete merged.search;

    setSearchParams(merged, { replace: true });
  }, [searchParams, setSearchParams]);

  const resetFilters = useCallback(() => {
    setSearchTerm("");
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  // Handle Debounced Search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      updateFilters({ search: searchTerm });
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, updateFilters]);

  // Sync data with URL changes
  useEffect(() => {
    loadJobs({ 
        search: queryParam, 
        category: categoryParam, 
        location: locationParam 
    });
  }, [queryParam, categoryParam, locationParam, loadJobs]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Search Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight uppercase">Find Work</h1>
          <p className="text-slate-500 mb-8 font-medium">Connecting Nigeria's best talent with top opportunities</p>
          
          <div className="max-w-2xl mx-auto relative group">
            <div className="relative">
              <Search className={`absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 transition-colors ${loading ? 'text-emerald-500 animate-pulse' : 'text-slate-400'}`} />
              <Input
                placeholder="Search jobs by title, skills or keywords..."
                className="pl-14 pr-12 py-8 text-lg shadow-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-emerald-500 rounded-2xl transition-all bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm("")} className="absolute right-5 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full text-slate-400">
                  <X size={18} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className={`lg:w-72 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <Card className="border-none shadow-sm p-6 sticky top-8 rounded-3xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-black text-slate-900 text-xs uppercase tracking-widest">Filters</h2>
                    {(locationParam !== "All" || categoryParam !== "All" || queryParam !== "") && (
                        <button onClick={resetFilters} className="text-[10px] font-black text-emerald-600 uppercase">Clear All</button>
                    )}
                </div>

              <div className="space-y-8">
                <div>
                    <h3 className="font-bold text-slate-400 mb-4 flex items-center gap-2 text-[10px] uppercase tracking-widest">
                        <MapPin className="w-3 h-3" /> Location
                    </h3>
                    <div className="space-y-1">
                    {LOCATIONS.map(loc => (
                        <button 
                          key={loc}
                          onClick={() => updateFilters({ location: loc })}
                          className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all flex justify-between items-center ${locationParam === loc ? 'bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-100' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                          {loc}
                          {locationParam === loc && <Check className="w-4 h-4" />}
                        </button>
                    ))}
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                    <h3 className="font-bold text-slate-400 mb-4 flex items-center gap-2 text-[10px] uppercase tracking-widest">
                        <SlidersHorizontal className="w-3 h-3" /> Category
                    </h3>
                    <div className="space-y-1">
                    {CATEGORIES.map(cat => (
                        <button 
                          key={cat}
                          onClick={() => updateFilters({ category: cat })}
                          className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all flex justify-between items-center ${categoryParam === cat ? 'bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-100' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                          {cat}
                          {categoryParam === cat && <Check className="w-4 h-4" />}
                        </button>
                    ))}
                    </div>
                </div>
              </div>
            </Card>
          </aside>

          <main className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
                <TabsList className="bg-white p-1 h-12 border shadow-sm rounded-xl">
                  <TabsTrigger value="jobs" className="px-8 rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white transition-all font-bold">Jobs</TabsTrigger>
                  <TabsTrigger value="freelancers" className="px-8 rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white transition-all font-bold">Freelancers</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{jobs.length} Results Found</span>
                <Button variant="outline" className="lg:hidden rounded-xl" onClick={() => setShowFilters(!showFilters)}>
                    <SlidersHorizontal className="w-4 h-4 mr-2" /> Filters
                </Button>
              </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100">
                    <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
                    <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Searching Marketplace...</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {activeTab === "jobs" ? (
                        jobs.length > 0 ? jobs.map(job => (
                            <Card key={job.id} className="border-none shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group rounded-2xl overflow-hidden bg-white">
                                <CardContent className="p-0">
                                    <div className="flex">
                                        <div className="w-1.5 bg-emerald-500 group-hover:w-3 transition-all"></div>
                                        <div className="p-6 flex-1 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                            <div className="space-y-3">
                                                <div className="flex gap-2">
                                                    <Badge className="bg-emerald-50 text-emerald-700 border-none px-3 py-1 text-[10px] font-black uppercase">{job.category}</Badge>
                                                    <Badge className="bg-slate-50 text-slate-500 border-none px-3 py-1 text-[10px] font-black uppercase">{job.experience_level || 'Intermediate'}</Badge>
                                                </div>
                                                <h3 className="text-xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors">{job.title}</h3>
                                                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500 font-medium">
                                                    <span className="flex items-center gap-1.5 font-bold text-slate-900">
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
                                                className="bg-slate-900 hover:bg-emerald-600 text-white px-8 h-12 rounded-xl font-black transition-all shadow-lg"
                                                onClick={() => navigate(`/job/${job.id}`)}
                                            >
                                                View Details
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )) : (
                            <NoResults resetFilters={resetFilters} />
                        )
                    ) : (
                        /* Placeholder for Freelancer results */
                        <div className="text-center py-20">
                            <p className="text-slate-400 font-bold uppercase tracking-widest">Freelancer search coming soon...</p>
                        </div>
                    )}
                </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// Sub-component to keep main code clean
function NoResults({ resetFilters }) {
  return (
    <div className="bg-white rounded-3xl p-16 text-center border-2 border-dashed border-slate-100">
        <Search className="w-12 h-12 text-slate-200 mx-auto mb-4" />
        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">No results matched your search</h3>
        <p className="text-slate-400 mt-2">Try adjusting your filters or checking for typos.</p>
        <Button variant="link" onClick={resetFilters} className="mt-4 text-emerald-600 font-bold">Clear all filters</Button>
    </div>
  );
}