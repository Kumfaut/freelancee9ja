"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../components/ui/Sheet";
import { Search, Filter, MapPin, Star, Bookmark, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "../components/ui/Button";
import FiltersContent from "../components/FiltersContent";
import Footer from "../components/Footer"; 

export default function BrowseJobsPage({ onNavigate }) {
  // --- STATE ---
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedState, setSelectedState] = useState("all");
  const [budgetRange, setBudgetRange] = useState([0, 500000]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState({ category: true, location: true, budget: true, skills: true });

  // --- DATA ---
  const categories = [
    { value: "all", label: "All Categories" },
    { value: "web-development", label: "Web Development" },
    { value: "design", label: "Design & Creative" },
    { value: "writing", label: "Writing & Content" },
    { value: "marketing", label: "Marketing" }
  ];

  const nigerianStates = ["Lagos State", "FCT Abuja", "Rivers", "Ogun", "Kano", "Enugu"];
  const allSkills = ["React", "Node.js", "Figma", "Python", "Tailwind CSS", "Paystack", "WordPress", "SEO"];

  const jobs = useMemo(() => [
    {
      id: 1,
      title: "E-commerce Website Development",
      description: "Looking for an experienced developer to build a modern e-commerce platform with Paystack integration.",
      budget: { min: 150000, max: 300000 },
      skills: ["React", "Node.js", "Paystack"],
      state: "Lagos State",
      category: "web-development",
      clientRating: 4.8,
      posted: "2h ago"
    },
    {
      id: 2,
      title: "UI/UX Design for Mobile App",
      description: "Need a clean, modern design for a fintech application based in Abuja.",
      budget: { min: 50000, max: 100000 },
      skills: ["Figma", "UI Design"],
      state: "FCT Abuja",
      category: "design",
      clientRating: 4.5,
      posted: "5h ago"
    }
  ], []);

  // --- HANDLERS ---
  const handleAuthAction = () => {
    if (onNavigate) onNavigate('login');
  };

  const toggleSkill = (skill) => {
    setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  };

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedState("all");
    setBudgetRange([0, 500000]);
    setSelectedSkills([]);
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || job.category === selectedCategory;
      const matchesState = selectedState === "all" || job.state === selectedState;
      const matchesBudget = job.budget.min >= budgetRange[0] && job.budget.max <= budgetRange[1];
      const matchesSkills = selectedSkills.length === 0 || selectedSkills.some(s => job.skills.includes(s));
      return matchesSearch && matchesCategory && matchesState && matchesBudget && matchesSkills;
    });
  }, [jobs, searchQuery, selectedCategory, selectedState, budgetRange, selectedSkills]);

  const filterProps = {
    categories, selectedCategory, setSelectedCategory,
    selectedState, setSelectedState, 
    selectedSkills, toggleSkill, allSkills, budgetRange, setBudgetRange,
    nigerianStates, filtersOpen, setFiltersOpen, clearFilters,
    toggleFilterSection: (s) => setFiltersOpen(prev => ({ ...prev, [s]: !prev[s] }))
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <div className="grow p-4 lg:p-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <Card className="sticky top-8 border-none shadow-sm ring-1 ring-slate-200/60">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2 font-bold text-slate-900">
                  <Filter className="h-4 w-4 text-emerald-600" /> Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FiltersContent {...filterProps} />
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-6">
            
            {/* GUEST HERO CTA */}
            <div className="bg-slate-900 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl shadow-slate-200">
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="space-y-2 text-center md:text-left">
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-none hover:bg-emerald-500/20 mb-2">
                    <Sparkles className="h-3 w-3 mr-1 fill-current" /> Join 10k+ Nigerian Freelancers
                  </Badge>
                  <h2 className="text-2xl md:text-3xl font-black tracking-tight">Ready to start earning?</h2>
                  <p className="text-slate-400 max-w-md">Create a profile to apply for jobs, message clients, and get paid securely.</p>
                </div>
                <Button onClick={handleAuthAction} size="lg" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-14 px-8 rounded-xl shadow-lg shadow-emerald-900/20 group">
                  Get Started <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
              {/* Decorative background shapes */}
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-600/10 rounded-full blur-3xl" />
              <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-emerald-600/10 rounded-full blur-3xl" />
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Browse Jobs</h1>
              </div>
              
              <Card className="border-none shadow-sm ring-1 ring-slate-200/60">
                <CardContent className="p-3 md:p-4 flex gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input 
                      className="pl-10 h-12 rounded-xl border-slate-200 bg-slate-50/50 focus-visible:ring-emerald-500" 
                      placeholder="Search jobs by keyword..." 
                      value={searchQuery} 
                      onChange={e => setSearchQuery(e.target.value)} 
                    />
                  </div>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden h-12 rounded-xl border-slate-200">
                        <Filter className="h-4 w-4 mr-2 text-emerald-600" /> Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80">
                      <SheetHeader><SheetTitle className="font-black text-2xl">Refine Jobs</SheetTitle></SheetHeader>
                      <div className="mt-6"><FiltersContent {...filterProps} /></div>
                    </SheetContent>
                  </Sheet>
                </CardContent>
              </Card>

              {/* Filter Badges */}
              <div className="flex justify-between items-center">
                <p className="text-sm font-bold text-slate-500">
                  <span className="text-slate-900 font-black">{filteredJobs.length}</span> jobs available now
                </p>
                {(selectedCategory !== "all" || selectedState !== "all" || selectedSkills.length > 0) && (
                  <Button variant="ghost" onClick={clearFilters} className="h-auto p-0 text-red-500 text-xs font-bold hover:bg-transparent hover:text-red-600">
                    Clear all filters
                  </Button>
                )}
              </div>
            </div>

            {/* Jobs List */}
            <div className="space-y-4">
              {filteredJobs.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                  <div className="bg-slate-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">No jobs found</h3>
                  <p className="text-slate-500">Try adjusting your filters or search terms.</p>
                </div>
              ) : (
                filteredJobs.map(job => (
                  <Card key={job.id} className="border-none shadow-sm hover:shadow-xl hover:ring-1 hover:ring-emerald-500/20 transition-all group rounded-2xl overflow-hidden cursor-pointer" onClick={handleAuthAction}>
                    <CardHeader className="pb-3 md:p-6">
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-none font-bold text-[10px] uppercase tracking-wider">
                              {categories.find(c => c.value === job.category)?.label}
                            </Badge>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{job.posted}</span>
                          </div>
                          <CardTitle className="text-xl md:text-2xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors">
                            {job.title}
                          </CardTitle>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 pt-1">
                            <span className="font-black text-emerald-600 text-base">₦{job.budget.min.toLocaleString()} - ₦{job.budget.max.toLocaleString()}</span>
                            <span className="flex items-center gap-1 font-bold"><MapPin className="h-4 w-4 text-slate-400" /> {job.state}</span>
                            <span className="flex items-center gap-1 font-bold text-yellow-600">
                              <Star className="h-4 w-4 fill-current" /> {job.clientRating}
                            </span>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="shrink-0 text-slate-300 group-hover:text-emerald-500 transition-colors rounded-xl h-12 w-12" onClick={(e) => { e.stopPropagation(); handleAuthAction(); }}>
                          <Bookmark className="h-6 w-6" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="md:px-6 md:pb-6">
                      <CardDescription className="text-slate-600 line-clamp-2 mb-6 text-base font-medium">
                        {job.description}
                      </CardDescription>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t border-slate-50 pt-6">
                        <div className="flex flex-wrap gap-2">
                          {job.skills.map(skill => (
                            <Badge key={skill} variant="outline" className="bg-slate-50 border-slate-100 text-slate-500 font-bold rounded-lg px-3 py-1">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <Button className="w-full sm:w-auto bg-slate-900 hover:bg-emerald-600 text-white font-black h-12 px-8 rounded-xl transition-all shadow-lg shadow-slate-200">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}