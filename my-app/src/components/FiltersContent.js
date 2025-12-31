"use client";

import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/Select";
import { Slider } from "../components/ui/Slider";
import { Separator } from "../components/ui/Separator";
import { Checkbox } from "../components/ui/Checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../components/ui/Collapsible";
import { ChevronDown, X } from "lucide-react";

const FilterSection = ({ title, isOpen, onToggle, children }) => (
  <Collapsible open={isOpen} onOpenChange={onToggle}>
    <CollapsibleTrigger className="flex items-center justify-between w-full py-2 hover:text-emerald-600 transition-colors text-sm font-semibold">
      <span>{title}</span>
      <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
    </CollapsibleTrigger>
    <CollapsibleContent className="space-y-3 pb-4">{children}</CollapsibleContent>
  </Collapsible>
);

const FiltersContent = ({
  categories, selectedCategory, setSelectedCategory,
  selectedState, setSelectedState, selectedLocation, setSelectedLocation,
  selectedSkills, toggleSkill, allSkills, budgetRange, setBudgetRange,
  nigerianStates, filtersOpen, toggleFilterSection, clearFilters
}) => {
  return (
    <div className="space-y-4">
      <FilterSection title="Category" isOpen={filtersOpen.category} onToggle={() => toggleFilterSection("category")}>
        <div className="space-y-2">
          {categories.map((c) => (
            <div key={c.value} className="flex items-center space-x-2">
              <Checkbox 
                id={`cat-${c.value}`} 
                checked={selectedCategory === c.value} 
                onCheckedChange={() => setSelectedCategory(c.value)} 
              />
              <label htmlFor={`cat-${c.value}`} className="text-sm cursor-pointer leading-none">{c.label}</label>
            </div>
          ))}
        </div>
      </FilterSection>

      <Separator />

      <FilterSection title="Location" isOpen={filtersOpen.location} onToggle={() => toggleFilterSection("location")}>
        <div className="space-y-3">
          <Select value={selectedState} onValueChange={setSelectedState}>
            <SelectTrigger className="w-full"><SelectValue placeholder="State" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              {nigerianStates.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Input 
            placeholder="City Name" 
            value={selectedLocation === "all" ? "" : selectedLocation} 
            onChange={e => setSelectedLocation(e.target.value || "all")} 
          />
        </div>
      </FilterSection>

      <Separator />

      <FilterSection title="Budget Range" isOpen={filtersOpen.budget} onToggle={() => toggleFilterSection("budget")}>
        <div className="pt-2 px-1">
          <Slider value={budgetRange} onValueChange={setBudgetRange} max={500000} step={5000} />
          <div className="flex justify-between text-xs mt-2 text-muted-foreground font-medium">
            <span>₦{budgetRange[0].toLocaleString()}</span>
            <span>₦{budgetRange[1].toLocaleString()}</span>
          </div>
        </div>
      </FilterSection>

      <Separator />

      <FilterSection title="Skills" isOpen={filtersOpen.skills} onToggle={() => toggleFilterSection("skills")}>
        {selectedSkills.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {selectedSkills.map(skill => (
              <Badge key={skill} variant="secondary" className="text-[10px] h-5 bg-emerald-50 text-emerald-700 border-emerald-100">
                {skill}
              </Badge>
            ))}
          </div>
        )}
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin">
          {allSkills.map(skill => (
            <div key={skill} className="flex items-center space-x-2">
              <Checkbox 
                id={`skill-${skill}`} 
                checked={selectedSkills.includes(skill)} 
                onCheckedChange={() => toggleSkill(skill)} 
              />
              <label htmlFor={`skill-${skill}`} className="text-sm cursor-pointer leading-none">{skill}</label>
            </div>
          ))}
        </div>
      </FilterSection>

      <Button onClick={clearFilters} variant="outline" size="sm" className="w-full text-xs hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all">
        Clear All Filters
      </Button>
    </div>
  );
};

export default FiltersContent;