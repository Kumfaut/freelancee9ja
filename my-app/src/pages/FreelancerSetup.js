"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Badge } from "../components/ui/Badge";
import { Progress } from "../components/ui/Progress";
import { Plus, X } from "lucide-react";

export default function FreelancerSetup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [skillInput, setSkillInput] = useState("");
  
  const [formData, setFormData] = useState({
    tagline: "",
    bio: "",
    skills: [],
    hourlyRate: ""
  });

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
    else navigate("/freelancer-dashboard"); // Navigate to the dashboard when done
  };

  const addSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim() && !formData.skills.includes(skillInput)) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
      setSkillInput("");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4">
      <div className="max-w-xl mx-auto space-y-8">
        <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold text-slate-900">Finish Your Profile</h1>
            <p className="text-slate-500">Step {step} of {totalSteps}</p>
            <Progress value={progress} className="h-2 w-full mt-4" />
        </div>

        <Card className="border-none shadow-xl">
          <CardContent className="pt-8">
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in">
                <Label>What is your professional title?</Label>
                <Input 
                    placeholder="e.g. Senior Graphics Designer" 
                    value={formData.tagline}
                    onChange={(e) => setFormData({...formData, tagline: e.target.value})}
                />
                <Label>Brief Bio</Label>
                <textarea 
                    className="w-full h-32 p-3 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="Tell clients about your 5 years of experience..."
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-in fade-in">
                <Label>Add your top skills</Label>
                <div className="flex gap-2">
                    <Input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} placeholder="React, Logo Design..." />
                    <Button onClick={addSkill} className="bg-emerald-600"><Plus /></Button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {formData.skills.map(s => (
                        <Badge key={s} variant="secondary" className="bg-emerald-50 text-emerald-700 px-3 py-1">
                            {s} <X className="ml-2 h-3 w-3 cursor-pointer" onClick={() => setFormData({...formData, skills: formData.skills.filter(x => x !== s)})} />
                        </Badge>
                    ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in fade-in">
                <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
                    <Label className="text-emerald-900">Your Hourly Rate (₦)</Label>
                    <div className="relative mt-2">
                        <span className="absolute left-3 top-2.5 text-slate-400 font-bold">₦</span>
                        <Input 
                            type="number" 
                            className="pl-8 text-xl font-bold" 
                            placeholder="5000"
                            value={formData.hourlyRate}
                            onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})}
                        />
                    </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-8">
              {step > 1 && <Button variant="outline" className="flex-1" onClick={() => setStep(step - 1)}>Back</Button>}
              <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleNext}>
                {step === 3 ? "Complete Setup" : "Continue"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}