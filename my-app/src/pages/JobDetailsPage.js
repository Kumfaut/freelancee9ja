"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchJobById, submitProposal } from "../api/api"; 
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { Label } from "../components/ui/Label";
import { 
  MapPin, ChevronLeft, ShieldCheck, X, Heart,
  Clock, Info, CheckCircle, Share2
} from "lucide-react";
import { toast } from "sonner";

// --- SUB-COMPONENT: PROPOSAL MODAL ---
function ProposalModal({ isOpen, onClose, jobTitle, jobId, onSuccess }) {
  const [formData, setFormData] = useState({ 
    bidAmount: "", 
    deliveryDays: "", // Matches MariaDB column 'delivery_days'
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
    if (Number(formData.bidAmount) <= 0) return toast.error("Please enter a valid bid amount");
    if (formData.coverLetter.length < 50) return toast.error("Cover letter must be at least 50 characters");
    
    setSubmitting(true);
    try {
      await submitProposal({
        job_id: jobId,
        bid_amount: Number(formData.bidAmount),
        timeline: parseInt(formData.deliveryDays, 10), // Send as Integer
        cover_letter: formData.coverLetter
      }); 
      
      toast.success("Proposal Sent Successfully!");
      onSuccess(); // Updates the parent UI state to 'Applied'
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send proposal");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4">
      <Card className="w-full max-w-xl shadow-2xl border-none animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b flex justify-between items-center bg-white rounded-t-2xl">
          <div>
            <h2 className="text-xl font-black text-slate-900">Submit Proposal</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
              Project: <span className="text-emerald-600">{jobTitle}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form className="p-8 space-y-6" onSubmit={handleSubmit}>
          <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
            <Label className="text-xs font-black text-emerald-800 uppercase tracking-widest mb-4 block">Your Bid Amount</Label>
            <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 font-black text-xl">₦</span>
                <Input 
                  type="number" 
                  className="pl-12 h-14 text-xl font-black bg-white border-none shadow-sm focus:ring-2 focus:ring-emerald-500 rounded-xl" 
                  placeholder="0"
                  value={formData.bidAmount}
                  onChange={(e) => setFormData({...formData, bidAmount: e.target.value})}
                  required 
                />
            </div>
            <div className="flex justify-between mt-4 px-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">You'll receive: ₦{calculations.takeHome.toLocaleString()}</span>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter">Fee (10%): ₦{calculations.fee.toLocaleString()}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label className="font-black text-slate-700 text-[10px] uppercase tracking-widest">Estimated Days to Deliver</Label>
              <Input 
                type="number" 
                placeholder="e.g. 7" 
                className="h-12 mt-1 rounded-xl border-slate-200" 
                value={formData.deliveryDays} 
                onChange={(e) => setFormData({...formData, deliveryDays: e.target.value})} 
                required 
              />
            </div>
            <div>
              <Label className="font-black text-slate-700 text-[10px] uppercase tracking-widest">Cover Letter</Label>
              <Textarea 
                placeholder="Explain why you are the best fit for this project..." 
                className="min-h-[140px] mt-1 rounded-xl border-slate-200" 
                value={formData.coverLetter} 
                onChange={(e) => setFormData({...formData, coverLetter: e.target.value})} 
                required 
              />
            </div>
          </div>

          <div className="flex gap-4 pt-2">
            <Button variant="ghost" type="button" className="flex-1 h-14 font-bold text-slate-400" onClick={onClose}>Cancel</Button>
            <Button disabled={submitting} className="flex-[2] bg-slate-900 hover:bg-emerald-600 text-white font-black h-14 rounded-xl shadow-lg transition-all">
              {submitting ? "Processing..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

// --- MAIN PAGE COMPONENT ---
export default function JobDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProposalOpen, setIsProposalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const fetchJobData = async () => {
    try {
      const response = await fetchJobById(id);
      // Ensure backend returns { success: true, data: { ...job, hasApplied: true/false } }
      setJob(response.data.data);
    } catch (error) {
      toast.error("Job details could not be loaded");
      navigate("/search");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getJobData = async () => {
      try {
        const response = await fetchJobById(id);
        setJob(response.data.data);
      } catch (error) {
        toast.error("Job details could not be loaded");
        navigate("/search");
      } finally {
        setLoading(false);
      }
    };

    getJobData();
  }, [id, navigate]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const skillsArray = Array.isArray(job?.skills) ? job.skills : job?.skills?.split(",").map(s => s.trim()) || [];

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24 font-sans">
      <div className="max-w-6xl mx-auto px-4 py-10">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-8">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-emerald-600 transition-colors font-bold text-xs uppercase tracking-[0.2em]">
                <ChevronLeft size={16} /> Marketplace
            </button>
            <div className="flex gap-3">
                <Button variant="outline" size="icon" className="rounded-full border-slate-200"><Share2 size={16} /></Button>
                <Button 
                    variant="outline" 
                    size="icon" 
                    className={`rounded-full border-slate-200 ${isSaved ? 'bg-red-50 border-red-100' : ''}`}
                    onClick={() => {
                        setIsSaved(!isSaved);
                        toast.success(isSaved ? "Removed from saved" : "Job saved for later");
                    }}
                >
                    <Heart size={16} className={isSaved ? "fill-red-500 text-red-500" : "text-slate-400"} />
                </Button>
            </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* LEFT COLUMN: CONTENT */}
          <div className="lg:col-span-2 space-y-8">
            <header className="space-y-6">
                <div className="flex flex-wrap gap-3">
                    <Badge className="bg-emerald-100 text-emerald-700 border-none px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{job?.category}</Badge>
                    <Badge className="bg-slate-100 text-slate-600 border-none px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{job?.experience_level || 'Intermediate'}</Badge>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight">{job?.title}</h1>
                <div className="flex flex-wrap gap-6 text-slate-500 text-sm font-medium">
                    <span className="flex items-center gap-2"><MapPin size={18} className="text-emerald-500" /> {job?.location}</span>
                    <span className="flex items-center gap-2"><Clock size={18} className="text-emerald-500" /> Posted {new Date(job?.created_at).toLocaleDateString()}</span>
                </div>
            </header>

            <Card className="border-none shadow-sm rounded-3xl p-8 bg-white">
                <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                    <Info size={20} className="text-emerald-500" /> Project Description
                </h3>
                <p className="text-slate-600 leading-[1.8] text-lg whitespace-pre-wrap">{job?.description}</p>
                
                <div className="mt-12 pt-8 border-t border-slate-50">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Required Expertise</h3>
                    <div className="flex flex-wrap gap-3">
                        {skillsArray.map(skill => (
                            <Badge key={skill} className="bg-slate-50 text-slate-600 border border-slate-200 py-2.5 px-6 rounded-xl font-bold hover:border-emerald-500 transition-all cursor-default">{skill}</Badge>
                        ))}
                    </div>
                </div>
            </Card>
          </div>

          {/* RIGHT COLUMN: ACTIONS */}
          <aside className="space-y-6">
            <Card className="border-none shadow-2xl bg-slate-900 text-white rounded-[2.5rem] p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-10 -mt-10 blur-3xl" />
                <div className="relative z-10 text-center lg:text-left">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Budget Range</p>
                    <h2 className="text-4xl font-black mt-2 mb-8">₦{Number(job?.budget_max).toLocaleString()}</h2>
                    
                    {job?.hasApplied ? (
                        <div className="w-full h-16 bg-slate-800 text-emerald-500 font-black rounded-2xl border border-slate-700 flex items-center justify-center gap-3">
                            <CheckCircle size={20} />
                            Application Sent
                        </div>
                    ) : (
                        <Button 
                            onClick={() => setIsProposalOpen(true)} 
                            className="w-full h-16 bg-emerald-500 hover:bg-white hover:text-slate-900 text-slate-900 font-black rounded-2xl transition-all text-lg shadow-xl shadow-emerald-500/20"
                        >
                            Apply Now
                        </Button>
                    )}
                    
                    <p className="mt-6 text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">
                        {job?.hasApplied ? "You've already applied for this role" : "Hiring status: Active"}
                    </p>
                </div>
            </Card>

            <Card className="border-none shadow-sm rounded-3xl p-8 bg-white space-y-6">
                <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trust & Security</h4>
                    <ShieldCheck size={18} className="text-emerald-500" />
                </div>
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center font-black text-slate-400 text-xs uppercase">NG</div>
                        <div>
                            <p className="text-sm font-black text-slate-900">Verified Client</p>
                            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter italic">Payment Verified</p>
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
        onSuccess={fetchJobData} // Re-fetches job to update 'hasApplied' status
      />
    </div>
  );
}