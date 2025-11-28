import React from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Checkbox } from "../ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { Slider } from "../ui/slider";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { ChevronDown } from "lucide-react";

export default function FiltersContent({
  categories,
  selectedCategory,
  setSelectedCategory,
  selectedState,
  setSelectedState,
  selectedLocation,
  setSelectedLocation,
  selectedSkills,
  toggleSkill,
  experienceLevel,
  setExperienceLevel,
  projectDuration,
  setProjectDuration,
  budgetRange,
  setBudgetRange,
  nigerianStates,
  allSkills,
  filtersOpen,
  toggleFilterSection,
  clearFilters
}) {
  const FilterSection = ({ title, isOpen, onToggle, children }) => (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger className="flex items-center justify-between w-full py-2 hover:text-emerald-600">
        <span>{title}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-3 pb-4">{children}</CollapsibleContent>
    </Collapsible>
  );

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <FilterSection title="Category" isOpen={filtersOpen.category} onToggle={() => toggleFilterSection('category')}>
        <div className="space-y-2">
          {categories.map(cat => (
            <div key={cat.value} className="flex items-center space-x-2">
              <Checkbox id={`category-${cat.value}`} checked={selectedCategory === cat.value} onCheckedChange={() => setSelectedCategory(cat.value)} />
              <label htmlFor={`category-${cat.value}`} className="text-sm">{cat.label}</label>
            </div>
          ))}
        </div>
      </FilterSection>

      <Separator />

      {/* Location Filter */}
      <FilterSection title="Location" isOpen={filtersOpen.location} onToggle={() => toggleFilterSection('location')}>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium mb-2 block">State</label>
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {nigerianStates.map(state => <SelectItem key={state} value={state}>{state}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">City</label>
            <Input placeholder="Enter city name" value={selectedLocation === "all" ? "" : selectedLocation} onChange={e => setSelectedLocation(e.target.value || "all")} />
          </div>
        </div>
      </FilterSection>

      <Separator />

      {/* Budget Filter */}
      <FilterSection title="Budget Range" isOpen={filtersOpen.budget} onToggle={() => toggleFilterSection('budget')}>
        <div className="space-y-4">
          <div className="px-2">
            <Slider value={budgetRange} onValueChange={setBudgetRange} max={500000} min={0} step={5000} className="w-full" />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>₦{budgetRange[0].toLocaleString()}</span>
            <span>₦{budgetRange[1].toLocaleString()}</span>
          </div>
        </div>
      </FilterSection>

      <Separator />

      {/* Skills Filter */}
      <FilterSection title="Skills" isOpen={filtersOpen.skills} onToggle={() => toggleFilterSection('skills')}>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {allSkills.slice(0, 20).map(skill => (
            <div key={skill} className="flex items-center space-x-2">
              <Checkbox id={`skill-${skill}`} checked={selectedSkills.includes(skill)} onCheckedChange={() => toggleSkill(skill)} />
              <label htmlFor={`skill-${skill}`} className="text-sm">{skill}</label>
            </div>
          ))}
        </div>
      </FilterSection>

      <Separator />

      {/* Experience Level Filter */}
      <FilterSection title="Experience Level" isOpen={filtersOpen.experience} onToggle={() => toggleFilterSection('experience')}>
        {["all","entry","intermediate","expert"].map(level => (
          <div key={level} className="flex items-center space-x-2">
            <Checkbox id={`experience-${level}`} checked={experienceLevel === level} onCheckedChange={() => setExperienceLevel(level)} />
            <label htmlFor={`experience-${level}`} className="text-sm">{level === "all" ? "All Levels" : level.charAt(0).toUpperCase() + level.slice(1)}</label>
          </div>
        ))}
      </FilterSection>

      <Separator />

      {/* Project Duration Filter */}
      <FilterSection title="Project Duration" isOpen={filtersOpen.duration} onToggle={() => toggleFilterSection('duration')}>
        {["all","Less than 1 month","1-3 months","3-6 months","More than 6 months"].map(duration => (
          <div key={duration} className="flex items-center space-x-2">
            <Checkbox id={`duration-${duration}`} checked={projectDuration === duration} onCheckedChange={() => setProjectDuration(duration)} />
            <label htmlFor={`duration-${duration}`} className="text-sm">{duration === "all" ? "Any Duration" : duration}</label>
          </div>
        ))}
      </FilterSection>

      <Separator />
      <Button onClick={clearFilters} variant="outline" className="w-full">Clear All Filters</Button>
    </div>
  );
}
