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
import { ShieldCheck, Briefcase, DollarSign, Code, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function PostJobPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({ 
    title: "", 
    category: "", 
    budgetType: "fixed",
    budgetAmount: "",
    description: "",
    skills: "" // We will split this into an array before sending to backend
  });

  const nextStep = () => {
    if (step === 1 && (!formData.title || !formData.description || !formData.category)) {
      toast.error("Please fill in all project details");
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = () => {
    if (!formData.budgetAmount) {
      toast.error("Please set a budget");
      return;
    }
    
    // This is where you will eventually call: axios.post('/api/jobs', formData)
    console.log("Submitting to Backend:", formData);
    toast.success("Job Posted Successfully!");
    navigate("/client-dashboard");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200 py-12 mb-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Badge className="mb-4 bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-100 px-4 py-1">
            Step {step} of 2: {step === 1 ? "Project Details" : "Budget & Skills"}
          </Badge>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            {step === 1 ? (
              <>What's your <span className="text-emerald-600">Project</span> about?</>
            ) : (
              <>Set your <span className="text-emerald-600">Budget</span> & Skills</>
            )}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          
          {step === 1 ? (
            /* STEP 1: CORE DETAILS */
            <Card className="border-none shadow-sm ring-1 ring-slate-200 animate-in fade-in slide-in-from-right-4">
              <CardHeader><CardTitle className="text-xl flex items-center gap-2"><Briefcase className="h-5 w-5 text-emerald-600" />Core Information</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Project Title</Label>
                  <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="e.g. Build a FinTech Landing Page" />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select onValueChange={(val) => setFormData({...formData, category: val})}>
                      <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dev">Web Development</SelectItem>
                        <SelectItem value="design">UI/UX Design</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Budget Type</Label>
                    <Select onValueChange={(val) => setFormData({...formData, budgetType: val})}>
                      <SelectTrigger><SelectValue placeholder="Fixed Price" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">Fixed Price</SelectItem>
                        <SelectItem value="hourly">Hourly Rate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Describe requirements..." className="min-h-37.5" />
                </div>
              </CardContent>
            </Card>
          ) : (
            /* STEP 2: BUDGET & SKILLS */
            <Card className="border-none shadow-sm ring-1 ring-slate-200 animate-in fade-in slide-in-from-right-4">
              <CardHeader><CardTitle className="text-xl flex items-center gap-2"><DollarSign className="h-5 w-5 text-emerald-600" />Budget & Talent</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Estimated Budget (₦)</Label>
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
              <Button variant="outline" onClick={prevStep} className="h-14 px-8 border-slate-200">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            )}
            <Button 
              onClick={step === 1 ? nextStep : handleSubmit}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-14 text-lg font-bold rounded-xl shadow-lg"
            >
              {step === 1 ? "Continue to Skills & Budget" : "Post This Job"}
            </Button>
          </div>
        </div>

        {/* Sidebar help */}
        <div className="space-y-4">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <ShieldCheck className="w-8 h-8 text-emerald-600 mb-4" />
            <h3 className="font-bold text-slate-900 mb-2">NaijaTrust Escrow</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Your money is safe. You only release funds to the freelancer when the project is done.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}