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
import { Briefcase, DollarSign, Code, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createJob } from "../api/api"; // Import the actual API call

export default function PostJobPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({ 
    title: "", 
    category: "", 
    budgetType: "fixed",
    budgetAmount: "",
    description: "",
    skills: "",
    location: "Remote", // Added default values to satisfy backend
    state: "Lagos", 
    experience_level: "Intermediate",
    duration: "1 month"
  });

  const nextStep = () => {
    if (step === 1 && (!formData.title || !formData.description || !formData.category)) {
      toast.error("Please fill in all project details");
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = async () => {
    if (!formData.budgetAmount) {
      toast.error("Please set a budget");
      return;
    }
    
    setIsLoading(true);
    try {
      const payload = {
        title: formData.title || "Untitled Project",
        description: formData.description || "No description",
        category: formData.category || "General",
        budget_min: Number(formData.budgetAmount) || 0,
        budget_max: Number(formData.budgetAmount) || 0,
        skills: formData.skills || "", 
        location: formData.location || "Remote",
        state: formData.state || "Lagos",
        experience_level: formData.experience_level || "Intermediate",
        duration: formData.duration || "1 month"
      };

      // The hang happens here if CORS blocks the response
      const response = await createJob(payload);
      
      if (response.data.success || response.status === 201) {
        toast.success("Job Posted Successfully!");
        
        // Use a slight delay so the user sees the success toast
        setTimeout(() => {
          navigate("/client-dashboard");
        }, 1200);
      }
    } catch (err) {
      console.error("Submission error details:", err.response || err);
      const errorMessage = err.response?.data?.error || err.response?.data?.message || "Failed to post job";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <div className="bg-white border-b border-slate-200 py-12 mb-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Badge className="mb-4 bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-100 px-4 py-1">
            Step {step} of 2
          </Badge>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            {step === 1 ? "Project Details" : "Budget & Skills"}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        <div className="space-y-6">
          {step === 1 ? (
            <Card className="border-none shadow-sm ring-1 ring-slate-200">
              <CardHeader><CardTitle className="text-xl flex items-center gap-2"><Briefcase className="h-5 w-5 text-emerald-600" />Core Information</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Project Title</Label>
                  <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="e.g. Build a Landing Page" />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select onValueChange={(val) => setFormData({...formData, category: val})}>
                      <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="web-development">Web Development</SelectItem>
                        <SelectItem value="design">UI/UX Design</SelectItem>
                        <SelectItem value="writing">Content Writing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Describe requirements..." className="min-h-[150px]" />
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-none shadow-sm ring-1 ring-slate-200">
              <CardHeader><CardTitle className="text-xl flex items-center gap-2"><DollarSign className="h-5 w-5 text-emerald-600" />Budget & Talent</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Budget (₦)</Label>
                  <Input type="number" value={formData.budgetAmount} onChange={(e) => setFormData({...formData, budgetAmount: e.target.value})} placeholder="e.g. 150000" />
                </div>
                <div className="space-y-2">
                  <Label>Required Skills (Comma separated)</Label>
                  <div className="relative">
                    <Code className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input className="pl-10" value={formData.skills} onChange={(e) => setFormData({...formData, skills: e.target.value})} placeholder="React, Node.js, Tailwind..." />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-4">
            {step > 1 && (
              <Button variant="outline" onClick={prevStep} disabled={isLoading} className="h-14 px-8">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            )}
            <Button 
              onClick={step === 1 ? nextStep : handleSubmit}
              disabled={isLoading}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 h-14 text-lg font-bold"
            >
              {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : step === 1 ? "Next Step" : "Post Job Now"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}