"use client";

import { useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/Select";
import { Search, MapPin, Star, Loader2, ShieldCheck, Zap, TrendingUp } from "lucide-react";
import ChatButton from "../components/ChatButton";
import Footer from "../components/Footer";
import { fetchUsers } from "../api/api";

export default function BrowseFreelancersPage() {
  const navigate = useNavigate();
  const [allFreelancers, setAllFreelancers] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [sortBy, setSortBy] = useState("rating");

  useEffect(() => {
    const loadFreelancers = async () => {
      try {
        setIsLoading(true);
        const response = await fetchUsers();
        
        const liveData = response.data
          .filter((user) => user.role === "freelancer")
          .map((f) => ({
            id: f.id,
            name: f.full_name,
            title: f.title || "Professional Freelancer",
            avatar: f.full_name ? f.full_name.charAt(0).toUpperCase() : "U",
            rating: f.rating || 5.0,
            reviews: f.reviews || 0,
            hourlyRate: f.hourlyRate || 0,
            location: f.location || "Nigeria",
            description: f.bio || "No bio provided yet.",
            skills: f.skills ? f.skills.split(",") : ["Expert"],
            category: f.category || "web-development",
            completedJobs: f.completedJobs || 0,
            isVetted: true, // Visual enhancement
          }));

        setAllFreelancers(liveData);
      } catch (error) {
        console.error("Error fetching freelancers:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadFreelancers();
  }, []);

  const filteredFreelancers = useMemo(() => {
    return allFreelancers
      .filter((f) => {
        const matchesSearch = 
          f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
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
  }, [allFreelancers, searchQuery, selectedCategory, selectedLocation, sortBy]);

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <div className="grow px-4 py-8 lg:py-12">
        <div className="max-w-7xl mx-auto">
          
          {/* Header & Stats Banner */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="space-y-2">
              <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-3 py-1 font-bold">
                <TrendingUp className="w-3 h-3 mr-1" /> 150+ New Freelancers this week
              </Badge>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Hire World-Class Talent</h1>
              <p className="text-slate-500 text-lg max-w-xl">
                The largest marketplace for vetted Nigerian developers, designers, and marketers.
              </p>
            </div>
          </div>

          {/* Enhanced Search Bar */}
          <Card className="mb-10 border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden">
            <CardContent className="p-2 md:p-3">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="relative flex-[2]">
                  <Search className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                  <Input
                    placeholder="Search by name, skill, or role..."
                    className="h-14 pl-12 border-none bg-transparent text-lg focus-visible:ring-0"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="h-10 w-[1px] bg-slate-100 hidden md:block self-center" />

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="h-14 border-none bg-transparent font-bold focus:ring-0 md:w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100">
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="web-development">Web Development</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="writing">Writing</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>

                <Button className="h-14 md:px-8 bg-slate-900 hover:bg-emerald-600 text-white font-black rounded-2xl transition-all">
                  Search Talents
                </Button>
              </div>
            </CardContent>
          </Card>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <Loader2 className="h-12 w-12 text-emerald-600 animate-spin" />
              <p className="text-slate-500 font-bold animate-pulse">Scanning the network for talent...</p>
            </div>
          ) : (
            <>
              {/* Sort & Filter Results */}
              <div className="flex justify-between items-center mb-8">
                <p className="text-sm font-bold text-slate-500">
                  <span className="text-slate-900 font-black">{filteredFreelancers.length}</span> professionals ready to work
                </p>
                <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm ring-1 ring-slate-200">
                  <span className="text-[10px] uppercase tracking-widest font-black text-slate-400 pl-2">Sort By</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="h-8 w-36 border-none bg-slate-50 font-bold text-xs rounded-lg">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredFreelancers.map((freelancer) => (
                  <Card key={freelancer.id} className="border-none shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-[2rem] overflow-hidden group bg-white">
                    <CardHeader className="p-6 pb-0">
                      <div className="flex justify-between items-start">
                        <div className="relative">
                          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-900 font-black text-2xl border-2 border-white shadow-inner group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                            {freelancer.avatar}
                          </div>
                          {freelancer.isVetted && (
                            <div className="absolute -right-2 -top-2 bg-emerald-500 text-white p-1 rounded-full border-2 border-white shadow-sm">
                              <ShieldCheck className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-black text-slate-900">₦{freelancer.hourlyRate.toLocaleString()}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Per Hour</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 space-y-1">
                        <CardTitle className="text-xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors">
                          {freelancer.name}
                        </CardTitle>
                        <p className="text-emerald-600 font-bold text-sm">{freelancer.title}</p>
                      </div>

                      <div className="flex items-center gap-2 mt-3 bg-slate-50 w-fit px-2 py-1 rounded-lg">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-black text-slate-700">{freelancer.rating}</span>
                        <span className="text-[10px] text-slate-400 font-bold">({freelancer.reviews} reviews)</span>
                      </div>
                    </CardHeader>

                    <CardContent className="p-6 space-y-6">
                      <CardDescription className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                        {freelancer.description}
                      </CardDescription>

                      <div className="flex flex-wrap gap-2">
                        {freelancer.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} className="bg-slate-50 hover:bg-slate-100 border-none text-slate-600 text-[10px] font-bold px-2 py-1 rounded-md">
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between py-4 border-y border-slate-50">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                          <MapPin className="h-3.5 w-3.5" /> {freelancer.location.split(',')[0]}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                          <Zap className="h-3.5 w-3.5 text-orange-500 fill-orange-500" /> {freelancer.completedJobs} projects
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <Button 
                          variant="outline" 
                          className="flex-1 h-12 rounded-xl border-slate-200 font-bold hover:bg-slate-50 text-slate-700 transition-all"
                          onClick={() => navigate(`/profile/${freelancer.id}`)}
                        >
                          Profile
                        </Button>
                        <ChatButton
                          otherUser={{
                            id: freelancer.id.toString(),
                            name: freelancer.name,
                            avatar: freelancer.avatar,
                            role: "freelancer",
                          }}
                          projectTitle="Hire Inquiry"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredFreelancers.length === 0 && (
                 <div className="text-center py-32 bg-white rounded-[3rem] mt-8 border-2 border-dashed border-slate-100">
                    <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 text-slate-200">
                      <Search className="h-10 w-10" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900">No matches found</h3>
                    <p className="text-slate-400 mt-1">Try broadening your search or resetting filters.</p>
                    <Button variant="link" onClick={() => { setSearchQuery(""); setSelectedCategory("all"); setSelectedLocation("all"); }} className="text-emerald-600 font-bold mt-4">Reset everything</Button>
                 </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}