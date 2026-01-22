"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Textarea } from "../components/ui/Textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/Select";
import { Badge } from "../components/ui/Badge";
import { Briefcase, DollarSign, Code, ArrowLeft, Loader2, Calendar } from "lucide-react";
import { toast } from "sonner";
import { createJob } from "../api/api";
import { APP_CATEGORIES } from "../constants/categories"; // Importing the "Source of Truth"

const LOCATIONS = ["Remote", "Lagos", "Abuja", "Port Harcourt", "Ibadan"];
const EXPERIENCE_LEVELS = ["Entry Level", "Intermediate", "Expert"];

export default function PostJobPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({ 
    title: "", 
    category: "", 
    budgetAmount: "",
    description: "",
    skills: "",
    location: "Remote",
    state: "Lagos", 
    experience_level: "Intermediate",
    duration: "1 month"
  });

  const nextStep = () => {
    if (step === 1 && (!formData.title || !formData.description || !formData.category)) {
      toast.error("Please fill in all project details");
      return;
    }
    setStep(2);
  };

  const prevStep = () => setStep(1);

  const handleSubmit = async () => {
    if (!formData.budgetAmount) {
      toast.error("Please set a budget");
      return;
    }
    
    setIsLoading(true);
    try {
      // Clean up skills: convert "React, Node" into ["React", "Node"]
      const skillsArray = formData.skills
        .split(",")
        .map(s => s.trim())
        .filter(s => s !== "");

      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category, // This will be the ID/Slug like 'web-development'
        budget_min: Number(formData.budgetAmount),
        budget_max: Number(formData.budgetAmount),
        skills: skillsArray, 
        location: formData.location,
        state: formData.state,
        experience_level: formData.experience_level,
        duration: formData.duration
      };

      const response = await createJob(payload);
      
      if (response.data.success) {
        toast.success("Job Posted Successfully!");
        setTimeout(() => navigate("/client-dashboard"), 1200);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Failed to post job";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Design Header */}
      <div className="bg-white border-b border-slate-200 py-12 mb-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Badge className="mb-4 bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-100 px-4 py-1">
            Step {step} of 2
          </Badge>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            {step === 1 ? "Project Details" : "Budget & Skills"}
          </h1>
          <p className="text-slate-500">Provide clear details to attract the best talent</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        <div className="space-y-6">
          {step === 1 ? (
            <Card className="border-none shadow-sm ring-1 ring-slate-200 rounded-3xl overflow-hidden">
              <CardHeader className="border-b border-slate-50 bg-slate-50/50">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-emerald-600" /> Core Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <Label className="font-bold text-slate-700">Project Title</Label>
                  <Input 
                    value={formData.title} 
                    onChange={(e) => setFormData({...formData, title: e.target.value})} 
                    placeholder="e.g. Build a Modern Landing Page for Real Estate" 
                    className="h-12"
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="font-bold text-slate-700">Category</Label>
                    <Select value={formData.category} onValueChange={(val) => setFormData({...formData, category: val})}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {APP_CATEGORIES.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-bold text-slate-700">Location</Label>
                    <Select value={formData.location} onValueChange={(val) => setFormData({...formData, location: val})}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Work Location" />
                      </SelectTrigger>
                      <SelectContent>
                        {LOCATIONS.map(loc => (
                          <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-bold text-slate-700">Description</Label>
                  <Textarea 
                    value={formData.description} 
                    onChange={(e) => setFormData({...formData, description: e.target.value})} 
                    placeholder="Describe the project goals, requirements, and deliverables..." 
                    className="min-h-[180px] rounded-xl" 
                  />
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-none shadow-sm ring-1 ring-slate-200 rounded-3xl overflow-hidden">
              <CardHeader className="border-b border-slate-50 bg-slate-50/50">
                <CardTitle className="text-xl flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-emerald-600" /> Budget & Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label className="font-bold text-slate-700">Fixed Budget (₦)</Label>
                    <div className="relative">
                       <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₦</span>
                       <Input 
                        type="number" 
                        value={formData.budgetAmount} 
                        onChange={(e) => setFormData({...formData, budgetAmount: e.target.value})} 
                        placeholder="0.00" 
                        className="pl-8 h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-bold text-slate-700">Experience Level</Label>
                    <Select value={formData.experience_level} onValueChange={(val) => setFormData({...formData, experience_level: val})}>
                      <SelectTrigger className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {EXPERIENCE_LEVELS.map(lvl => (
                          <SelectItem key={lvl} value={lvl}>{lvl}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-bold text-slate-700">Required Skills</Label>
                  <div className="relative">
                    <Code className="absolute left-4 top-4 h-4 w-4 text-slate-400" />
                    <Input 
                      className="pl-12 h-14" 
                      value={formData.skills} 
                      onChange={(e) => setFormData({...formData, skills: e.target.value})} 
                      placeholder="React, Node.js, UI Design (separate with commas)..." 
                    />
                  </div>
                </div>
                
                <div className="bg-emerald-50 p-4 rounded-2xl flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-emerald-600 mt-0.5" />
                    <div>
                        <p className="text-sm font-bold text-emerald-900">Project Duration</p>
                        <p className="text-xs text-emerald-700">Estimated time for this project: {formData.duration}</p>
                    </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            {step > 1 && (
              <Button variant="outline" onClick={prevStep} disabled={isLoading} className="h-14 px-10 rounded-2xl border-2 hover:bg-slate-50 font-bold transition-all">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            )}
            <Button 
              onClick={step === 1 ? nextStep : handleSubmit}
              disabled={isLoading}
              className="flex-1 bg-slate-900 hover:bg-emerald-600 h-14 text-lg font-bold rounded-2xl transition-all shadow-xl shadow-slate-200"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin h-5 w-5" /> 
                    <span>Processing...</span>
                </div>
              ) : step === 1 ? "Next Step" : "Launch Project"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}