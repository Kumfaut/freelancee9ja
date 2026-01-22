"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Badge } from "../components/ui/Badge";
import { Progress } from "../components/ui/Progress";
import { Plus, X, Upload, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

export default function FreelancerSetup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [skillInput, setSkillInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    tagline: "",
    bio: "",
    skills: [],
    hourlyRate: "",
    cvFile: null // New field for CV
  });

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  // Handler for file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "application/pdf" || file.type === "application/msword" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
      setFormData({ ...formData, cvFile: file });
    } else {
      toast.error("Please upload a PDF or Word document");
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Use FormData for file uploads
      const data = new FormData();
      data.append("tagline", formData.tagline);
      data.append("bio", formData.bio);
      data.append("skills", JSON.stringify(formData.skills));
      data.append("hourlyRate", formData.hourlyRate);
      if (formData.cvFile) data.append("cv", formData.cvFile);

      // Replace with your actual API endpoint
      await axios.post("http://localhost:5000/api/users/setup-profile", data, {
        headers: { 
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      toast.success("Profile completed successfully!");
      navigate("/freelancer-dashboard");
    } catch (err) {
      toast.error("Failed to save profile. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
    else handleSubmit();
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
        <div className="space-y-4 text-center">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Expert Onboarding</h1>
            <div className="space-y-1">
              <p className="text-slate-500 text-sm font-medium">Step {step} of {totalSteps}</p>
              <Progress value={progress} className="h-2 w-full bg-slate-200" />
            </div>
        </div>

        <Card className="border-none shadow-2xl rounded-[2rem] overflow-hidden">
          <CardContent className="p-10">
            {/* STEP 1: TITLE & BIO */}
            {step === 1 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <Label className="text-xs uppercase font-black tracking-widest text-slate-400">Professional Title</Label>
                  <Input 
                      placeholder="e.g. Senior Graphics Designer" 
                      className="h-12 rounded-xl"
                      value={formData.tagline}
                      onChange={(e) => setFormData({...formData, tagline: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase font-black tracking-widest text-slate-400">Your Story</Label>
                  <textarea 
                      className="w-full h-40 p-4 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                      placeholder="Briefly describe your expertise..."
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  />
                </div>
              </div>
            )}

            {/* STEP 2: SKILLS */}
            {step === 2 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <Label className="text-xs uppercase font-black tracking-widest text-slate-400">Expertise Tags</Label>
                <div className="flex gap-2">
                    <Input 
                      value={skillInput} 
                      onChange={(e) => setSkillInput(e.target.value)} 
                      placeholder="React, Figma..." 
                      className="h-12 rounded-xl"
                      onKeyPress={(e) => e.key === 'Enter' && addSkill(e)}
                    />
                    <Button onClick={addSkill} className="bg-slate-900 h-12 w-12 rounded-xl hover:bg-emerald-600"><Plus /></Button>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                    {formData.skills.map(s => (
                        <Badge key={s} className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg border-none flex items-center gap-2">
                            {s} <X className="h-3 w-3 cursor-pointer" onClick={() => setFormData({...formData, skills: formData.skills.filter(x => x !== s)})} />
                        </Badge>
                    ))}
                    {formData.skills.length === 0 && <p className="text-slate-400 text-xs italic">No skills added yet.</p>}
                </div>
              </div>
            )}

            {/* STEP 3: RATE & CV */}
            {step === 3 && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                <div className="bg-slate-900 p-8 rounded-3xl text-white">
                    <Label className="text-slate-400 text-[10px] uppercase font-black tracking-[0.2em]">Set Your Hourly Rate</Label>
                    <div className="relative mt-4">
                        <span className="absolute left-0 top-0 text-3xl font-black text-emerald-400">₦</span>
                        <input 
                            type="number" 
                            className="bg-transparent border-none text-5xl font-black w-full pl-8 focus:outline-none" 
                            placeholder="0"
                            value={formData.hourlyRate}
                            onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-xs uppercase font-black tracking-widest text-slate-400">Upload Professional CV (PDF)</Label>
                  {!formData.cvFile ? (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 hover:border-emerald-300 transition-all">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 text-slate-300 mb-2" />
                        <p className="text-xs text-slate-500 font-bold">Click to upload or drag and drop</p>
                      </div>
                      <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
                    </label>
                  ) : (
                    <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <div className="flex items-center gap-3">
                        <FileText className="text-emerald-600" />
                        <div className="max-w-[200px] truncate text-sm font-bold text-emerald-900">{formData.cvFile.name}</div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setFormData({...formData, cvFile: null})} className="text-emerald-700 hover:bg-emerald-100">
                        <X size={16} />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-4 mt-10">
              {step > 1 && (
                <Button variant="ghost" className="flex-1 h-14 rounded-2xl font-bold text-slate-500" onClick={() => setStep(step - 1)}>
                  Back
                </Button>
              )}
              <Button 
                className={`flex-1 h-14 rounded-2xl font-black uppercase tracking-widest shadow-lg transition-all ${step === 3 ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' : 'bg-slate-900 hover:bg-black'}`}
                onClick={handleNext}
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : step === 3 ? "Launch Profile" : "Next Step"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}