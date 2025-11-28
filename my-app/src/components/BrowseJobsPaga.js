import React, { useState, useMemo } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "../ui/Sheet";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/Select";
import { Filter, Search } from "lucide-react";
import FiltersContent from "./FiltersContent";
import JobCard from "./JobCard";

export default function BrowseJobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedState, setSelectedState] = useState("all");
  const [budgetRange, setBudgetRange] = useState([0, 500000]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [experienceLevel, setExperienceLevel] = useState("all");
  const [projectDuration, setProjectDuration] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState({
    category: true,
    location: true,
    budget: true,
    skills: false,
    experience: false,
    duration: false
  });

  // Dummy data arrays: jobs, categories, nigerianStates, allSkills
  // (Use your current arrays for jobs, states, skills, categories)

  const toggleSkill = (skill) => {
    setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  };

  const toggleFilterSection = (section) => {
    setFiltersOpen(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const clearFilters = () => {
    setSearchQuery(""); setSelectedCategory("all"); setSelectedLocation("all");
    setSelectedState("all"); setBudgetRange([0,500000]); setSelectedSkills([]);
    setExperienceLevel("all"); setProjectDuration("all");
  };

  const formatBudget = (job) => {
    const min = job.budget.min.toLocaleString();
    const max = job.budget.max.toLocaleString();
    const type = job.budget.type === "hourly" ? "/hr" : "";
    return `₦${min} - ₦${max}${type}`;
  };

  // filteredJobs useMemo logic (same as your existing logic)
  
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="mb-4 text-2xl font-bold">Browse Jobs</h1>
          <p className="text-muted-foreground">Discover opportunities from clients across Nigeria looking for your skills.</p>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <FiltersContent
              categories={categories}
              selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
              selectedState={selectedState} setSelectedState={setSelectedState}
              selectedLocation={selectedLocation} setSelectedLocation={setSelectedLocation}
              selectedSkills={selectedSkills} toggleSkill={toggleSkill}
              experienceLevel={experienceLevel} setExperienceLevel={setExperienceLevel}
              projectDuration={projectDuration} setProjectDuration={setProjectDuration}
              budgetRange={budgetRange} setBudgetRange={setBudgetRange}
              nigerianStates={nigerianStates} allSkills={allSkills}
              filtersOpen={filtersOpen} toggleFilterSection={toggleFilterSection}
              clearFilters={clearFilters}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Search & Mobile Filters */}
            <div className="flex gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search jobs..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
              </div>
              <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden"><Filter className="w-4 h-4 mr-2" />Filters</Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Filter Jobs</SheetTitle>
                    <SheetDescription>Refine your search to find the perfect job</SheetDescription>
                  </SheetHeader>
                  <div className="mt-6">
                    <FiltersContent
                      categories={categories} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
                      selectedState={selectedState} setSelectedState={setSelectedState}
                      selectedLocation={selectedLocation} setSelectedLocation={setSelectedLocation}
                      selectedSkills={selectedSkills} toggleSkill={toggleSkill}
                      experienceLevel={experienceLevel} setExperienceLevel={setExperienceLevel}
                      projectDuration={projectDuration} setProjectDuration={setProjectDuration}
                      budgetRange={budgetRange} setBudgetRange={setBudgetRange}
                      nigerianStates={NigerianCities} allSkills={allSkills}
                      filtersOpen={filtersOpen} toggleFilterSection={toggleFilterSection}
                      clearFilters={clearFilters}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Jobs List */}
            <div className="space-y-6">
              {filteredJobs.map(job => <JobCard key={job.id} job={job} formatBudget={formatBudget} toggleSkill={toggleSkill} />)}
              {filteredJobs.length === 0 && (
                <div className="text-center p-12">
                  <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
                  <p className="text-muted-foreground mb-4">Try adjusting your filters or search terms.</p>
                  <Button onClick={clearFilters} variant="outline">Clear All Filters</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
