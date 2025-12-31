"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/Tabs";
import { Avatar, AvatarFallback } from "../components/ui/Avatar";
import { 
  Search, MapPin, DollarSign, SlidersHorizontal, Check, Star 
} from "lucide-react";

export default function SearchPage({ initialQuery = "" }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const locations = ["All", "Lagos", "Abuja", "Port Harcourt", "Ibadan", "Remote"];
  const categories = ["All", "Web Development", "UI/UX Design", "Content Writing", "Marketing"];

  const allJobs = [
    {
      id: 1,
      title: "React Developer for E-commerce Platform",
      description: "Looking for an experienced React developer to build a modern e-commerce platform with Paystack integration",
      budget: { min: 500000, max: 800000 },
      category: "Web Development",
      location: "Lagos",
      postedDate: "2 days ago",
      skills: ["React", "Node.js", "Paystack"]
    },
    {
      id: 2,
      title: "Mobile App UI/UX Designer",
      description: "Need a talented UI/UX designer to create mobile app designs for a fintech startup",
      budget: { min: 200000, max: 350000 },
      category: "UI/UX Design",
      location: "Abuja",
      postedDate: "1 day ago",
      skills: ["Figma", "UI Design"]
    }
  ];

  const allFreelancers = [
    {
      id: 1,
      name: "Adebayo Oluwaseun",
      title: "Full Stack Developer",
      location: "Lagos",
      category: "Web Development",
      rate: 5000,
      rating: 4.9,
    }
  ];

  // Filtering Logic
  const filteredJobs = allJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = selectedLocation === "All" || job.location === selectedLocation;
    const matchesCategory = selectedCategory === "All" || job.category === selectedCategory;
    return matchesSearch && matchesLocation && matchesCategory;
  });

  const filteredFreelancers = allFreelancers.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = selectedLocation === "All" || f.location === selectedLocation;
    const matchesCategory = selectedCategory === "All" || f.category === selectedCategory;
    return matchesSearch && matchesLocation && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Search Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-6">Find Opportunities</h1>
          <div className="max-w-2xl mx-auto relative mb-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Search jobs, freelancers or skills..."
                className="pl-12 pr-12 py-7 text-lg shadow-sm focus:ring-emerald-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <aside className={`lg:w-64 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <Card className="border-none shadow-sm p-5 space-y-6">
              <div>
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-xs uppercase tracking-widest">
                  <MapPin className="w-4 h-4 text-emerald-600" /> Location
                </h3>
                <div className="space-y-1">
                  {locations.map(loc => (
                    <button 
                      key={loc}
                      onClick={() => setSelectedLocation(loc)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all flex justify-between items-center ${selectedLocation === loc ? 'bg-emerald-600 text-white font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                      {loc}
                      {selectedLocation === loc && <Check className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-xs uppercase tracking-widest">
                  <SlidersHorizontal className="w-4 h-4 text-emerald-600" /> Category
                </h3>
                <div className="space-y-1">
                  {categories.map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all flex justify-between items-center ${selectedCategory === cat ? 'bg-emerald-600 text-white font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                      {cat}
                      {selectedCategory === cat && <Check className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
                <TabsList className="bg-white border shadow-sm">
                  <TabsTrigger value="all">All Results</TabsTrigger>
                  <TabsTrigger value="jobs">Jobs</TabsTrigger>
                  <TabsTrigger value="freelancers">Freelancers</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button 
                variant="outline" 
                className="lg:hidden" 
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                {showFilters ? "Hide Filters" : "Filters"}
              </Button>
            </div>

            <div className="space-y-8">
              {/* Jobs Results */}
              {(activeTab === "all" || activeTab === "jobs") && (
                <div className="space-y-4">
                  <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
                    Available Jobs ({filteredJobs.length})
                  </h2>
                  {filteredJobs.length > 0 ? filteredJobs.map(job => (
                    <Card key={job.id} className="border-none shadow-sm hover:shadow-md transition-all group">
                      <CardContent className="p-6">
                         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="space-y-2">
                                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none">{job.category}</Badge>
                                <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                                  {job.title}
                                </h3>
                                <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                                    <span className="flex items-center gap-1 font-bold text-slate-900">
                                        <DollarSign className="w-4 h-4 text-emerald-600" /> ₦{job.budget.min.toLocaleString()} - ₦{job.budget.max.toLocaleString()}
                                    </span>
                                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</span>
                                    <span className="text-slate-300">•</span>
                                    <span>{job.postedDate}</span>
                                </div>
                            </div>
                            <Button 
                              className="bg-emerald-600 hover:bg-emerald-700 w-full md:w-auto px-8"
                              onClick={() => navigate(`/job/${job.id}`)}
                            >
                              View Details
                            </Button>
                         </div>
                      </CardContent>
                    </Card>
                  )) : <p className="text-slate-400 italic py-4">No jobs found matching your criteria.</p>}
                </div>
              )}

              {/* Freelancers Results */}
              {(activeTab === "all" || activeTab === "freelancers") && (
                  <div className="space-y-4 mt-8">
                      <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Top Freelancers ({filteredFreelancers.length})</h2>
                      {filteredFreelancers.map(f => (
                          <Card key={f.id} className="border-none shadow-sm hover:shadow-md transition-all">
                              <CardContent className="p-6">
                                  <div className="flex flex-col md:flex-row items-center gap-6">
                                      <Avatar className="h-16 w-16 ring-4 ring-white shadow-md shrink-0">
                                          <AvatarFallback className="bg-emerald-500 text-white font-bold text-xl">{f.name[0]}</AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1 text-center md:text-left">
                                          <div className="flex flex-col md:flex-row items-center gap-2">
                                            <h3 className="font-bold text-slate-900 text-lg">{f.name}</h3>
                                            <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-none font-bold">
                                              <Star className="w-3 h-3 fill-amber-500 text-amber-500 mr-1" /> {f.rating}
                                            </Badge>
                                          </div>
                                          <p className="text-sm font-semibold text-emerald-600 mt-1">{f.title}</p>
                                          <p className="text-xs text-slate-500 mt-2 flex items-center justify-center md:justify-start gap-1">
                                            <MapPin className="w-3 h-3" /> {f.location} • <span className="font-bold text-slate-900">₦{f.rate.toLocaleString()}/hr</span>
                                          </p>
                                      </div>
                                      <Button 
                                        variant="outline" 
                                        className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 w-full md:w-auto px-6 font-bold"
                                        onClick={() => navigate(`/freelancer/${f.id}`)}
                                      >
                                        View Profile
                                      </Button>
                                  </div>
                              </CardContent>
                          </Card>
                      ))}
                  </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}