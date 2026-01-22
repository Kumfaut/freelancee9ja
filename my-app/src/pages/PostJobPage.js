"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Textarea } from "../components/ui/Textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/Select";
import { Badge } from "../components/ui/Badge";
import { Briefcase, DollarSign, Code, ArrowLeft, Loader2, Calendar, Globe } from "lucide-react";
import { toast } from "sonner";
import { createJob } from "../api/api";
import { APP_CATEGORIES } from "../constants/categories";

const LOCATIONS = ["Remote", "Lagos", "Abuja", "Port Harcourt", "Ibadan"];
const EXPERIENCE_LEVELS = ["Entry Level", "Intermediate", "Expert"];

export default function PostJobPage() {
  const { t, i18n } = useTranslation();
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
    experience_level: "Intermediate",
    duration: "1 month"
  });

  const nextStep = () => {
    if (step === 1 && (!formData.title || !formData.description || !formData.category)) {
      toast.error(t('fill_all_fields'));
      return;
    }
    setStep(2);
  };

  const handleSubmit = async () => {
    if (!formData.budgetAmount) return toast.error(t('set_budget_error'));
    
    setIsLoading(true);
    try {
      const skillsArray = formData.skills.split(",").map(s => s.trim()).filter(s => s !== "");

      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        budget_min: Number(formData.budgetAmount),
        budget_max: Number(formData.budgetAmount),
        skills: skillsArray, 
        location: formData.location,
        experience_level: formData.experience_level,
        duration: formData.duration
      };

      const response = await createJob(payload);
      if (response.data.success) {
        toast.success(t('job_post_success'));
        setTimeout(() => navigate("/client-dashboard"), 1200);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || t('job_post_error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <div className="bg-white border-b border-slate-200 py-12 mb-10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
             <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl ring-1 ring-slate-200">
                <Globe className="w-3 h-3 text-slate-400" />
                <select 
                    className="text-[9px] font-black uppercase outline-none bg-transparent cursor-pointer"
                    value={i18n.language}
                    onChange={(e) => i18n.changeLanguage(e.target.value)}
                >
                    <option value="en">EN</option>
                    <option value="pcm">PCM</option>
                    <option value="ig">IG</option>
                    <option value="yo">YO</option>
                    <option value="ha">HA</option>
                </select>
            </div>
          </div>
          <Badge className="mb-4 bg-emerald-50 text-emerald-700 border-emerald-100 px-4 py-1 font-black text-[10px] uppercase tracking-[0.2em]">
            Step {step} / 2
          </Badge>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">
            {step === 1 ? t('post_job_header') : t('post_job_budget')}
          </h1>
          <p className="text-slate-500 font-bold">{t('post_job_subtitle')}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4">
        {step === 1 ? (
          <Card className="border-none shadow-sm ring-1 ring-slate-200 rounded-[2.5rem] overflow-hidden bg-white">
            <CardHeader className="border-b border-slate-50 bg-slate-50/30 p-8">
              <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-3 text-slate-400">
                <Briefcase className="h-5 w-5 text-emerald-500" /> {t('core_info')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-10 space-y-8">
              <div className="space-y-3">
                <Label className="font-black text-[10px] uppercase tracking-widest text-slate-500 ml-1">{t('project_title')}</Label>
                <Input 
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})} 
                  placeholder="e.g. Build a Modern Landing Page" 
                  className="h-16 rounded-2xl border-slate-200 text-lg font-bold focus:ring-emerald-500"
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="font-black text-[10px] uppercase tracking-widest text-slate-500 ml-1">{t('category_label')}</Label>
                  <Select value={formData.category} onValueChange={(val) => setFormData({...formData, category: val})}>
                    <SelectTrigger className="h-14 rounded-2xl border-slate-200 font-bold">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                      {APP_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id} className="font-bold py-3">{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="font-black text-[10px] uppercase tracking-widest text-slate-500 ml-1">{t('location_label')}</Label>
                  <Select value={formData.location} onValueChange={(val) => setFormData({...formData, location: val})}>
                    <SelectTrigger className="h-14 rounded-2xl border-slate-200 font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                      {LOCATIONS.map(loc => (
                        <SelectItem key={loc} value={loc} className="font-bold py-3">{loc}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="font-black text-[10px] uppercase tracking-widest text-slate-500 ml-1">{t('description_label')}</Label>
                <Textarea 
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})} 
                  placeholder="..." 
                  className="min-h-[200px] rounded-3xl border-slate-200 p-6 text-base font-medium leading-relaxed" 
                />
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-none shadow-sm ring-1 ring-slate-200 rounded-[2.5rem] overflow-hidden bg-white">
            <CardHeader className="border-b border-slate-50 bg-slate-50/30 p-8">
              <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-3 text-slate-400">
                <DollarSign className="h-5 w-5 text-emerald-500" /> {t('budget_req')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-10 space-y-10">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="font-black text-[10px] uppercase tracking-widest text-slate-500 ml-1">{t('fixed_budget')} (₦)</Label>
                  <div className="relative">
                     <span className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-600 font-black text-xl">₦</span>
                     <Input 
                      type="number" 
                      value={formData.budgetAmount} 
                      onChange={(e) => setFormData({...formData, budgetAmount: e.target.value})} 
                      placeholder="0.00" 
                      className="pl-12 h-16 rounded-2xl border-slate-200 text-xl font-black"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="font-black text-[10px] uppercase tracking-widest text-slate-500 ml-1">{t('experience_label')}</Label>
                  <Select value={formData.experience_level} onValueChange={(val) => setFormData({...formData, experience_level: val})}>
                    <SelectTrigger className="h-16 rounded-2xl border-slate-200 font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                      {EXPERIENCE_LEVELS.map(lvl => (
                        <SelectItem key={lvl} value={lvl} className="font-bold py-3">{lvl}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="font-black text-[10px] uppercase tracking-widest text-slate-500 ml-1">{t('skills_label')}</Label>
                <div className="relative">
                  <Code className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input 
                    className="pl-14 h-16 rounded-2xl border-slate-200 font-bold" 
                    value={formData.skills} 
                    onChange={(e) => setFormData({...formData, skills: e.target.value})} 
                    placeholder={t('skills_placeholder')} 
                  />
                </div>
              </div>
              
              <div className="bg-emerald-50/50 ring-1 ring-emerald-100 p-6 rounded-[1.5rem] flex items-center gap-5 transition-all hover:bg-emerald-50">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <Calendar className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                      <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">{t('duration_label')}</p>
                      <p className="text-sm font-bold text-slate-600">{t('estimated_time')}: <span className="text-emerald-700">{formData.duration}</span></p>
                  </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-4 mt-10">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(1)} disabled={isLoading} className="h-16 px-10 rounded-2xl border-2 border-slate-200 font-black uppercase text-xs tracking-widest hover:bg-slate-50 transition-all">
              <ArrowLeft className="mr-2 h-4 w-4" /> {t('back')}
            </Button>
          )}
          <Button 
            onClick={step === 1 ? nextStep : handleSubmit}
            disabled={isLoading}
            className="flex-1 bg-slate-900 hover:bg-emerald-600 h-16 text-xs font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-slate-200 active:scale-[0.98]"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin h-5 w-5" /> 
                  <span>{t('processing')}</span>
              </div>
            ) : step === 1 ? t('next_step') : t('launch_project')}
          </Button>
        </div>
      </div>
    </div>
  );
}