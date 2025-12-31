"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../components/ui/Sheet";
import { Search, Filter, MapPin, Star, Bookmark, X } from "lucide-react";
import { Button } from "../components/ui/Button";
import FiltersContent from "../components/FiltersContent";
import Footer from "../components/Footer"; 

export default function BrowseJobsPage() {
  // --- STATE ---
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
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
      clientRating: 4.8
    },
    {
      id: 2,
      title: "UI/UX Design for Mobile App",
      description: "Need a clean, modern design for a fintech application based in Abuja.",
      budget: { min: 50000, max: 100000 },
      skills: ["Figma", "UI Design"],
      state: "FCT Abuja",
      category: "design",
      clientRating: 4.5
    }
  ], []);

  // --- LOGIC ---
  const toggleSkill = (skill) => {
    setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  };

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedState("all");
    setSelectedLocation("all");
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
    selectedState, setSelectedState, selectedLocation, setSelectedLocation,
    selectedSkills, toggleSkill, allSkills, budgetRange, setBudgetRange,
    nigerianStates, filtersOpen, setFiltersOpen, clearFilters,
    toggleFilterSection: (s) => setFiltersOpen(prev => ({ ...prev, [s]: !prev[s] }))
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      {/* Main Content Wrapper - flex-grow(changed to grow) ensures footer stays at bottom */}
      <div className="grow p-4 lg:p-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <Card className="sticky top-8 border-none shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2 font-bold">
                  <Filter className="h-4 w-4 text-emerald-600" /> Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FiltersContent {...filterProps} />
              </CardContent>
            </Card>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 space-y-6">
            <div className="flex flex-col gap-4">
              <h1 className="text-3xl font-bold text-slate-900">Browse Jobs</h1>
              
              {/* Search Bar */}
              <Card className="border-none shadow-sm">
                <CardContent className="p-4 flex gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input 
                      className="pl-10 border-slate-200 focus-visible:ring-emerald-500" 
                      placeholder="Search by job title or keyword..." 
                      value={searchQuery} 
                      onChange={e => setSearchQuery(e.target.value)} 
                    />
                  </div>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden">
                        <Filter className="h-4 w-4 mr-2" /> Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80">
                      <SheetHeader>
                        <SheetTitle>Refine Jobs</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <FiltersContent {...filterProps} />
                      </div>
                    </SheetContent>
                  </Sheet>
                </CardContent>
              </Card>

              {/* Results Counter & Active Filters */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-slate-500">
                    Showing <span className="text-slate-900">{filteredJobs.length}</span> jobs found
                  </p>
                  {filteredJobs.length < jobs.length && (
                    <Button variant="link" onClick={clearFilters} className="h-auto p-0 text-emerald-600 text-sm">
                      Reset all
                    </Button>
                  )}
                </div>

                {(selectedCategory !== "all" || selectedState !== "all" || selectedSkills.length > 0) && (
                  <div className="flex flex-wrap gap-2 items-center">
                    {selectedCategory !== "all" && (
                      <Badge variant="secondary" className="bg-white border-slate-200 text-slate-700 py-1 pr-1 gap-1">
                        {categories.find(c => c.value === selectedCategory)?.label}
                        <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => setSelectedCategory("all")} />
                      </Badge>
                    )}
                    {selectedState !== "all" && (
                      <Badge variant="secondary" className="bg-white border-slate-200 text-slate-700 py-1 pr-1 gap-1">
                        {selectedState}
                        <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => setSelectedState("all")} />
                      </Badge>
                    )}
                    {selectedSkills.map(s => (
                      <Badge key={s} variant="secondary" className="bg-white border-slate-200 text-slate-700 py-1 pr-1 gap-1">
                        {s}
                        <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => toggleSkill(s)} />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Jobs List */}
            <div className="space-y-4">
              {filteredJobs.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                  <Search className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No jobs match your current filters.</p>
                </div>
              ) : (
                filteredJobs.map(job => (
                  <Card key={job.id} className="border-none shadow-sm hover:shadow-md transition-all group overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <CardTitle className="text-xl text-slate-900 group-hover:text-emerald-600 transition-colors">
                            {job.title}
                          </CardTitle>
                          <div className="flex items-center gap-3 text-sm text-slate-500">
                            <span className="flex items-center gap-1 font-medium text-emerald-600">
                              ₦{job.budget.min.toLocaleString()} - ₦{job.budget.max.toLocaleString()}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.state}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-yellow-600">
                              <Star className="h-3 w-3 fill-current" /> {job.clientRating}
                            </span>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-emerald-600">
                          <Bookmark className="h-5 w-5" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-slate-600 line-clamp-2 mb-4">
                        {job.description}
                      </CardDescription>
                      <div className="flex justify-between items-center">
                        <div className="flex flex-wrap gap-2">
                          {job.skills.map(skill => (
                            <Badge key={skill} variant="outline" className="bg-slate-50 border-slate-200 text-slate-600 text-[11px]">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <Button className="bg-emerald-600 hover:bg-emerald-700 font-bold px-6">Apply Now</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Footer is now inside the final return but outside the main content area */}
      <Footer />
    </div>
  );
}
 