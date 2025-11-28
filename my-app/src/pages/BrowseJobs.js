"use client";

import { useState, useMemo } from "react";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/Select";
import { Checkbox } from "../components/ui/checkbox";
import { Slider } from "../components/ui/Slider";
import { Separator } from "../components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../components/ui/sheet";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../components/ui/collapsible";
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  Bookmark, 
  ChevronDown, 
  Star,
  Briefcase,
  Calendar,
  X
} from "lucide-react";

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

  const jobs = [
    // ... (same job data you already provided)
  ];

  const nigerianStates = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
    "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo",
    "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos State",
    "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers",
    "Sokoto", "Taraba", "Yobe", "Zamfara", "FCT Abuja"
  ];

  const allSkills = [
    "React", "Vue.js", "Angular", "Node.js", "Python", "PHP", "Laravel", "WordPress",
    "JavaScript", "TypeScript", "HTML/CSS", "MongoDB", "PostgreSQL", "MySQL",
    "Adobe Illustrator", "Photoshop", "Figma", "Adobe XD", "Sketch",
    "Content Writing", "SEO", "Blog Writing", "Copywriting", "Technical Writing",
    "Social Media", "Content Creation", "Analytics", "Instagram Marketing", "Facebook Ads",
    "Data Analysis", "Machine Learning", "SQL", "Pandas", "Visualization",
    "Video Editing", "After Effects", "Premiere Pro", "Motion Graphics", "Animation",
    "UI Design", "UX Research", "Prototyping", "User Testing", "Wireframing",
    "Mobile Development", "React Native", "Flutter", "iOS", "Android",
    "Digital Marketing", "Google Ads", "Email Marketing", "Lead Generation"
  ];

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "web-development", label: "Web Development" },
    { value: "design", label: "Design & Creative" },
    { value: "writing", label: "Writing & Content" },
    { value: "marketing", label: "Marketing & Sales" },
    { value: "data-science", label: "Data Science & Analytics" },
    { value: "video-audio", label: "Video & Audio" },
    { value: "mobile-development", label: "Mobile Development" },
    { value: "consulting", label: "Business Consulting" }
  ];

  // Filter and sort jobs
  const filteredJobs = useMemo(() => {
    let filtered = jobs.filter(job => {
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(query);
        const matchesDescription = job.description.toLowerCase().includes(query);
        const matchesSkills = job.skills.some(skill => skill.toLowerCase().includes(query));
        if (!matchesTitle && !matchesDescription && !matchesSkills) return false;
      }

      // Category filter
      if (selectedCategory !== "all" && job.category !== selectedCategory) return false;

      // Location filter
      if (selectedLocation !== "all" && !job.location.toLowerCase().includes(selectedLocation.toLowerCase())) return false;

      // State filter
      if (selectedState !== "all" && job.state !== selectedState) return false;

      // Budget filter
      if (job.budget.min > budgetRange[1] || job.budget.max < budgetRange[0]) return false;

      // Skills filter
      if (selectedSkills.length > 0) {
        const hasMatchingSkill = selectedSkills.some(skill => 
          job.skills.some(jobSkill => jobSkill.toLowerCase().includes(skill.toLowerCase()))
        );
        if (!hasMatchingSkill) return false;
      }

      // Experience level filter
      if (experienceLevel !== "all" && job.experienceLevel !== experienceLevel) return false;

      // Project duration filter
      if (projectDuration !== "all" && job.duration !== projectDuration) return false;

      return true;
    });

    // Sort jobs
    switch (sortBy) {
      case "budget-high":
        filtered.sort((a, b) => b.budget.max - a.budget.max);
        break;
      case "budget-low":
        filtered.sort((a, b) => a.budget.min - b.budget.min);
        break;
      case "proposals":
        filtered.sort((a, b) => a.proposals - b.proposals);
        break;
      case "rating":
        filtered.sort((a, b) => b.clientRating - a.clientRating);
        break;
      case "newest":
      default:
        filtered.sort((a, b) => b.postedDate.getTime() - a.postedDate.getTime());
        break;
    }

    return filtered;
  }, [searchQuery, selectedCategory, selectedLocation, selectedState, budgetRange, selectedSkills, experienceLevel, projectDuration, sortBy]);

  const toggleSkill = (skill) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedLocation("all");
    setSelectedState("all");
    setBudgetRange([0, 500000]);
    setSelectedSkills([]);
    setExperienceLevel("all");
    setProjectDuration("all");
  };

  const formatBudget = (job) => {
    const min = job.budget.min.toLocaleString();
    const max = job.budget.max.toLocaleString();
    const type = job.budget.type === "hourly" ? "/hr" : "";
    return `₦${min} - ₦${max}${type}`;
  };

  const toggleFilterSection = (section) => {
    setFiltersOpen(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const FilterSection = ({ title, isOpen, onToggle, children }) => (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger className="flex items-center justify-between w-full py-2 hover:text-emerald-600">
        <span>{title}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-3 pb-4">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* CATEGORY */}
      <FilterSection title="Category" isOpen={filtersOpen.category} onToggle={() => toggleFilterSection('category')}>
        <div className="space-y-2">
          {categories.map(category => (
            <div key={category.value} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.value}`}
                checked={selectedCategory === category.value}
                onCheckedChange={() => setSelectedCategory(category.value)}
              />
              <label htmlFor={`category-${category.value}`} className="text-sm">{category.label}</label>
            </div>
          ))}
        </div>
      </FilterSection>

      <Separator />

      {/* STATE */}
      <FilterSection title="Location" isOpen={filtersOpen.location} onToggle={() => toggleFilterSection('location')}>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium mb-2 block">State</label>
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {nigerianStates.map(state => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">City</label>
            <Input
              placeholder="Enter city name"
              value={selectedLocation === "all" ? "" : selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value || "all")}
            />
          </div>
        </div>
      </FilterSection>

      {/* ...repeat similar JS-compatible code for Budget, Skills, Experience, Duration */}
      
      <Button onClick={clearFilters} variant="outline" className="w-full">Clear All Filters</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ...rest of your JSX for search bar, desktop & mobile filters, job listings, etc. */}
    </div>
  );
}
