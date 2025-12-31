"use client";

import { useState, useMemo } from "react";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/Select";
import { Search, MapPin, Star, Clock, Briefcase } from "lucide-react";
import ChatButton from "../components/ChatButton";
import Footer from "../components/Footer";

export default function BrowseFreelancersPage() {
  // --- STATE ---
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [sortBy, setSortBy] = useState("rating");

  // --- DATA ---
  // --- LOGIC ---
  // --- LOGIC ---
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedLocation("all");
  };
  const filteredFreelancers = useMemo(() => {
    // 1. Move the data inside so it doesn't trigger the Hook unnecessarily
    const freelancers = [
      {
        id: 1,
        name: "Adebayo Okafor",
        title: "Full Stack Developer",
        avatar: "AO",
        rating: 4.9,
        reviews: 127,
        hourlyRate: 3500,
        location: "Lagos, Nigeria",
        description: "Experienced full-stack developer specializing in React, Node.js, and cloud deployments.",
        skills: ["React", "Node.js", "AWS", "MongoDB", "TypeScript"],
        category: "web-development",
        completedJobs: 89,
        responseTime: "2 hours",
      },
      {
        id: 2,
        name: "Fatima Aliyu",
        title: "UI/UX Designer",
        avatar: "FA",
        rating: 5.0,
        reviews: 94,
        hourlyRate: 2800,
        location: "Abuja, Nigeria",
        description: "Creative designer with 5+ years experience in mobile and web app design.",
        skills: ["Figma", "Adobe XD", "Prototyping", "User Research"],
        category: "design",
        completedJobs: 76,
        responseTime: "1 hour",
      },
      // ... rest of your freelancer objects
    ];

    // 2. Perform the filtering and sorting
    return freelancers
      .filter((f) => {
        const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             f.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "all" || f.category === selectedCategory;
        const matchesLocation = selectedLocation === "all" || f.location.includes(selectedLocation);
        return matchesSearch && matchesCategory && matchesLocation;
      })
      .sort((a, b) => {
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "rate-low") return a.hourlyRate - b.hourlyRate;
        if (sortBy === "rate-high") return b.hourlyRate - a.hourlyRate;
        if (sortBy === "reviews") return b.reviews - a.reviews;
        return 0;
      });
  }, [searchQuery, selectedCategory, selectedLocation, sortBy]); // Notice 'freelancers' is no longer needed here

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      {/* Main Content Wrapper */}
      <div className="grow px-4 py-8 lg:py-12">
        <div className="max-w-7xl mx-auto">
          
          {/* Page Header */}
          <div className="mb-8 space-y-2">
            <h1 className="text-3xl font-bold text-slate-900">Find Top Freelancers</h1>
            <p className="text-slate-500 max-w-2xl">
              Hire vetted Nigerian professionals for your next project. 
              Filter by skill, location, or rating to find the perfect match.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <Card className="mb-8 border-none shadow-sm">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search by name or skill..."
                    className="pl-10 border-slate-200 focus-visible:ring-emerald-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="border-slate-200">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="web-development">Web Development</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="writing">Writing</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="border-slate-200">
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Nigeria</SelectItem>
                    <SelectItem value="Lagos">Lagos</SelectItem>
                    <SelectItem value="Abuja">Abuja</SelectItem>
                    <SelectItem value="Port Harcourt">Port Harcourt</SelectItem>
                  </SelectContent>
                </Select>

                <Button className="bg-emerald-600 hover:bg-emerald-700 font-semibold shadow-sm shadow-emerald-200">
                  Search Professionals
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Metadata */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-600">
                Found {filteredFreelancers.length} available freelancers
              </span>
              {(selectedCategory !== "all" || selectedLocation !== "all" || searchQuery !== "") && (
                 <Button variant="ghost" onClick={clearFilters} className="h-8 text-xs text-red-500 hover:text-red-600">
                    Reset Filters
                 </Button>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-500">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 border-none bg-transparent font-semibold focus:ring-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="rate-low">Lowest Rate</SelectItem>
                  <SelectItem value="rate-high">Highest Rate</SelectItem>
                  <SelectItem value="reviews">Most Reviews</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Freelancer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFreelancers.map((freelancer) => (
              <Card key={freelancer.id} className="border-none shadow-sm hover:shadow-md transition-all group overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 font-bold text-xl border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        {freelancer.avatar}
                      </div>
                      <div>
                        <CardTitle className="text-lg text-slate-900">{freelancer.name}</CardTitle>
                        <p className="text-emerald-600 text-xs font-semibold uppercase tracking-wider">{freelancer.title}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-3">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-bold text-slate-700">{freelancer.rating}</span>
                    <span className="text-xs text-slate-400">({freelancer.reviews} reviews)</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <CardDescription className="text-slate-600 text-sm line-clamp-3 h-15">
                    {freelancer.description}
                  </CardDescription>

                  <div className="flex flex-wrap gap-1.5">
                    {freelancer.skills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="outline" className="bg-slate-50 border-slate-100 text-slate-500 text-[10px]">
                        {skill}
                      </Badge>
                    ))}
                    {freelancer.skills.length > 3 && (
                      <Badge variant="outline" className="bg-slate-50 border-slate-100 text-slate-500 text-[10px]">
                        +{freelancer.skills.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-y-2 pt-2 border-t border-slate-50">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin className="h-3.5 w-3.5" /> {freelancer.location.split(',')[0]}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Briefcase className="h-3.5 w-3.5" /> {freelancer.completedJobs} jobs
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Clock className="h-3.5 w-3.5" /> {freelancer.responseTime}
                    </div>
                    <div className="text-emerald-700 font-bold text-sm">
                      ₦{freelancer.hourlyRate.toLocaleString()}/hr
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" className="flex-1 border-slate-200 text-slate-700 hover:bg-slate-50">
                      View Profile
                    </Button>
                    <ChatButton
                      otherUser={{
                        id: freelancer.id.toString(),
                        name: freelancer.name,
                        avatar: freelancer.avatar,
                        role: "freelancer",
                        isOnline: Math.random() > 0.5,
                      }}
                      projectTitle="General Inquiry"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredFreelancers.length === 0 && (
             <div className="text-center py-24">
                <p className="text-slate-400">No freelancers found matching your criteria.</p>
                <Button variant="link" onClick={clearFilters} className="text-emerald-600">Clear all filters</Button>
             </div>
          )}

          {/* Load More */}
          {filteredFreelancers.length > 0 && (
            <div className="text-center mt-16">
              <Button variant="outline" size="lg" className="rounded-full px-8 border-slate-200 text-slate-600">
                Load More Professionals
              </Button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}