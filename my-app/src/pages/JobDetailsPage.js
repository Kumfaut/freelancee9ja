"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchJobById, submitProposal } from "../api/api"; 
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { Label } from "../components/ui/Label";
import { 
  MapPin, ChevronLeft, ShieldCheck, X, Heart,
  Clock, Info, CheckCircle, Share2, Globe, Languages, Loader2
} from "lucide-react";
import { toast } from "sonner";
import { translateDynamicContent } from '../utils/translateUtil';

// --- SUB-COMPONENT: PROPOSAL MODAL ---
function ProposalModal({ isOpen, onClose, jobTitle, jobId, onSuccess }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ 
    bidAmount: "", 
    deliveryDays: "", 
    coverLetter: "" 
  });
  const [submitting, setSubmitting] = useState(false);
  
  const PLATFORM_FEE_RATE = 0.10; 

  const calculations = useMemo(() => {
    const bid = Number(formData.bidAmount) || 0;
    const fee = bid * PLATFORM_FEE_RATE;
    return { fee, takeHome: bid - fee };
  }, [formData.bidAmount]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Number(formData.bidAmount) <= 0) return toast.error(t('invalid_bid'));
    if (formData.coverLetter.length < 50) return toast.error(t('cover_letter_short'));
    
    setSubmitting(true);
    try {
      await submitProposal({
        job_id: jobId,
        bid_amount: Number(formData.bidAmount),
        timeline: parseInt(formData.deliveryDays, 10),
        cover_letter: formData.coverLetter
      }); 
      
      toast.success(t('proposal_success'));
      onSuccess(); 
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || t('proposal_error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <Card className="w-full max-w-xl shadow-2xl border-none rounded-[2.5rem] overflow-hidden bg-white">
        <div className="p-8 border-b flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">{t('submit_proposal')}</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
              Project: <span className="text-emerald-600">{jobTitle}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form className="p-8 space-y-6" onSubmit={handleSubmit}>
          <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100">
            <Label className="text-[10px] font-black text-emerald-800 uppercase tracking-widest mb-4 block">{t('bid_amount_label')}</Label>
            <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 font-black text-2xl">₦</span>
                <Input 
                  type="number" 
                  className="pl-12 h-16 text-2xl font-black bg-white border-none shadow-inner focus:ring-2 focus:ring-emerald-500 rounded-2xl" 
                  placeholder="0"
                  value={formData.bidAmount}
                  onChange={(e) => setFormData({...formData, bidAmount: e.target.value})}
                  required 
                />
            </div>
            <div className="flex justify-between mt-4 px-1">
                <span className="text-[10px] font-black text-slate-500 uppercase">{t('receive_amount')}: ₦{calculations.takeHome.toLocaleString()}</span>
                <span className="text-[10px] font-black text-emerald-600 uppercase">{t('fee_label')} (10%): ₦{calculations.fee.toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="font-black text-slate-700 text-[10px] uppercase tracking-widest ml-1">{t('delivery_days_label')}</Label>
              <Input 
                type="number" 
                placeholder="e.g. 7" 
                className="h-14 mt-1 rounded-2xl border-slate-200 font-bold" 
                value={formData.deliveryDays} 
                onChange={(e) => setFormData({...formData, deliveryDays: e.target.value})} 
                required 
              />
            </div>
            <div>
              <Label className="font-black text-slate-700 text-[10px] uppercase tracking-widest ml-1">{t('cover_letter_label')}</Label>
              <Textarea 
                placeholder={t('cover_letter_placeholder')} 
                className="min-h-40 mt-1 rounded-2xl border-slate-200 font-medium leading-relaxed p-4" 
                value={formData.coverLetter} 
                onChange={(e) => setFormData({...formData, coverLetter: e.target.value})} 
                required 
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button variant="ghost" type="button" className="flex-1 h-14 font-black uppercase text-xs tracking-widest text-slate-400" onClick={onClose}>{t('cancel')}</Button>
            <Button disabled={submitting} className="flex-2 bg-slate-900 hover:bg-emerald-600 text-white font-black h-14 rounded-2xl shadow-xl transition-all uppercase text-xs tracking-widest">
              {submitting ? t('processing') : t('submit_application')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

// --- MAIN PAGE COMPONENT ---
export default function JobDetailsPage() {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProposalOpen, setIsProposalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Translation States
  const [translatedDesc, setTranslatedDesc] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [isShowingTranslation, setIsShowingTranslation] = useState(false);

  useEffect(() => {
    const getJobData = async () => {
      try {
        const response = await fetchJobById(id);
        const jobData = response.data.data;
        setJob(jobData);
        setTranslatedDesc(jobData.description);
      } catch (error) {
        toast.error(t('load_error'));
        navigate("/search");
      } finally {
        setLoading(false);
      }
    };
    getJobData();
  }, [id, navigate, t]);

  const handleTranslate = async () => {
    if (isShowingTranslation) {
        setTranslatedDesc(job.description);
        setIsShowingTranslation(false);
        return;
    }

    setIsTranslating(true);
    try {
      const result = await translateDynamicContent(job.description, i18n.language);
      setTranslatedDesc(result);
      setIsShowingTranslation(true);
    } catch (error) {
      toast.error(t('translation_failed'));
    } finally {
      setIsTranslating(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const skillsArray = Array.isArray(job?.skills) ? job.skills : job?.skills?.split(",").map(s => s.trim()) || [];

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24 font-sans">
      <div className="max-w-6xl mx-auto px-4 py-10">
        
        <div className="flex items-center justify-between mb-12">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-emerald-600 transition-colors font-black text-[10px] uppercase tracking-[0.3em]">
                <ChevronLeft size={16} /> {t('marketplace_back')}
            </button>
            <div className="flex gap-3 items-center">
                <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl shadow-sm ring-1 ring-slate-200 mr-2">
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
                <Button variant="outline" size="icon" className="rounded-xl border-slate-200"><Share2 size={16} /></Button>
                <Button 
                    variant="outline" 
                    size="icon" 
                    className={`rounded-xl border-slate-200 ${isSaved ? 'bg-red-50 border-red-100' : ''}`}
                    onClick={() => {
                        setIsSaved(!isSaved);
                        toast.success(isSaved ? t('removed_saved') : t('job_saved'));
                    }}
                >
                    <Heart size={16} className={isSaved ? "fill-red-500 text-red-500" : "text-slate-400"} />
                </Button>
            </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            <header className="space-y-6 text-left">
                <div className="flex flex-wrap gap-3">
                    <Badge className="bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 border-none px-4 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">{job?.category}</Badge>
                    <Badge className="bg-slate-100 text-slate-600 border-none px-4 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">{job?.experience_level || 'Intermediate'}</Badge>
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight tracking-tighter uppercase">{job?.title}</h1>
                <div className="flex flex-wrap gap-8 text-slate-500 text-xs font-black uppercase tracking-widest">
                    <span className="flex items-center gap-2"><MapPin size={18} className="text-emerald-500" /> {job?.location}</span>
                    <span className="flex items-center gap-2"><Clock size={18} className="text-emerald-500" /> {t('posted')} {new Date(job?.created_at).toLocaleDateString()}</span>
                </div>
            </header>

            <Card className="border-none shadow-sm rounded-[2.5rem] p-10 bg-white ring-1 ring-slate-100 relative">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-3 uppercase tracking-tight">
                        <Info size={24} className="text-emerald-500" /> {t('project_description')}
                    </h3>
                    {i18n.language && !i18n.language.startsWith('en') && (
                        <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={handleTranslate}
                            disabled={isTranslating}
                            className="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:bg-emerald-50 px-4 rounded-full"
                        >
                            {isTranslating ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : <Languages className="w-3 h-3 mr-2" />}
                            {isTranslating ? "..." : isShowingTranslation ? t('show_original') : t('see_translation')}
                        </Button>
                    )}
                </div>
                <div className="relative">
                    {isShowingTranslation && (
                        <Badge variant="outline" className="mb-4 border-emerald-100 text-emerald-600 text-[8px] font-black uppercase tracking-[0.2em]">
                           {t('machine_translated')}
                        </Badge>
                    )}
                    <p className="text-slate-600 leading-[1.8] text-lg whitespace-pre-wrap font-medium">{translatedDesc}</p>
                </div>
                
                <div className="mt-12 pt-10 border-t border-slate-50">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">{t('required_expertise')}</h3>
                    <div className="flex flex-wrap gap-3">
                        {skillsArray.map(skill => (
                            <Badge key={skill} className="bg-slate-50 text-slate-900 border border-slate-200 py-3 px-8 rounded-2xl font-black text-xs hover:ring-2 hover:ring-emerald-500 transition-all cursor-default uppercase tracking-tight">{skill}</Badge>
                        ))}
                    </div>
                </div>
            </Card>
          </div>

          <aside className="space-y-8">
            <Card className="border-none shadow-2xl bg-slate-900 text-white rounded-[3rem] p-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/20 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-emerald-500/30 transition-all" />
                <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400 mb-2">{t('budget_range')}</p>
                    <h2 className="text-5xl font-black tracking-tighter mb-10">₦{Number(job?.budget_max).toLocaleString()}</h2>
                    
                    {job?.hasApplied ? (
                        <div className="w-full h-20 bg-slate-800 text-emerald-400 font-black rounded-3xl border border-slate-700 flex items-center justify-center gap-3 uppercase tracking-widest text-xs">
                            <CheckCircle size={22} /> {t('application_sent')}
                        </div>
                    ) : (
                        <Button 
                            onClick={() => setIsProposalOpen(true)} 
                            className="w-full h-20 bg-emerald-500 hover:bg-white hover:text-slate-900 text-slate-900 font-black rounded-3xl transition-all text-sm uppercase tracking-[0.2em] shadow-2xl shadow-emerald-500/30 active:scale-95"
                        >
                            {t('apply_now')}
                        </Button>
                    )}
                    <p className="mt-8 text-[9px] text-slate-500 font-black uppercase tracking-widest text-center italic">{job?.hasApplied ? t('already_applied') : t('hiring_active')}</p>
                </div>
            </Card>

            <Card className="border-none shadow-sm rounded-[2.5rem] p-10 bg-white ring-1 ring-slate-100 space-y-8">
                <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('trust_security')}</h4>
                    <ShieldCheck size={20} className="text-emerald-500" />
                </div>
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-900 text-sm uppercase shadow-inner">NG</div>
                        <div>
                            <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{t('verified_client')}</p>
                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest italic">{t('payment_verified')}</p>
                        </div>
                    </div>
                </div>
            </Card>
          </aside>
        </div>
      </div>

      <ProposalModal 
        isOpen={isProposalOpen} 
        onClose={() => setIsProposalOpen(false)} 
        jobTitle={job?.title} 
        jobId={id} 
        onSuccess={() => setJob(prev => ({ ...prev, hasApplied: true }))} 
      />
    </div>
  );
}