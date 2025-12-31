"use client";

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { Label } from "../components/ui/Label";
import { 
  MapPin, Calendar, ChevronLeft, 
  Share2, ShieldCheck, Briefcase, X, Send, Heart 
} from "lucide-react";
import Footer from "../components/Footer";

// --- PROPOSAL MODAL COMPONENT ---
function ProposalModal({ isOpen, onClose, jobTitle, baseBudget }) {
  const [bidAmount, setBidAmount] = useState("");
  const [timeline, setTimeline] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  
  const PLATFORM_FEE_RATE = 0.10; // 10% Service Fee

  if (!isOpen) return null;

  // Real-time calculations
  const fee = Number(bidAmount) * PLATFORM_FEE_RATE;
  const takeHome = Number(bidAmount) - fee;

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you'd send this data to your backend/Firebase here
    console.log({ bidAmount, timeline, coverLetter, takeHome });
    alert(`Proposal submitted! \nTotal Bid: ₦${Number(bidAmount).toLocaleString()} \nYour Net: ₦${takeHome.toLocaleString()}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <Card className="w-full max-w-xl shadow-2xl border-none animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-xl">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Submit Your Proposal</h2>
            <p className="text-xs text-emerald-600 font-semibold uppercase mt-1">Job: {jobTitle}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors shadow-sm">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form className="p-6 space-y-5" onSubmit={handleSubmit}>
          {/* EARNINGS CALCULATOR SECTION */}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-slate-500 uppercase">Your Total Bid (₦)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₦</span>
                <Input 
                  type="number" 
                  placeholder="500,000" 
                  className="pl-8 bg-white border-emerald-200 focus:ring-emerald-500 font-bold text-lg" 
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  required 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-slate-500 uppercase">You'll Receive (₦)</Label>
              <div className="h-11.5 flex items-center px-4 bg-white border border-emerald-200 rounded-md text-emerald-700 font-bold text-lg shadow-sm">
                ₦{takeHome.toLocaleString()}
              </div>
            </div>
            <p className="md:col-span-2 text-[10px] text-slate-500 italic">
              * Includes 10% (₦{fee.toLocaleString()}) NaijaFreelance service fee for secure escrow protection.
            </p>
          </div>

          <div className="space-y-2">
            <Label className="font-semibold text-slate-700 text-sm">Estimated Timeline</Label>
            <Input 
              placeholder="e.g. 10 days" 
              className="focus:ring-emerald-500" 
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              required 
            />
          </div>

          <div className="space-y-2">
            <Label className="font-semibold text-slate-700 text-sm">Cover Letter / Pitch</Label>
            <Textarea 
              placeholder="Describe your experience with similar projects..."
              className="min-h-30 focus:ring-emerald-500 resize-none"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              required
            />
          </div>

          <div className="pt-2 flex gap-3">
            <Button variant="outline" type="button" className="flex-1 h-12" onClick={onClose}>
              Cancel
            </Button>
            <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 h-12 gap-2 font-bold text-white shadow-lg shadow-emerald-200">
              <Send className="w-4 h-4" /> Send Proposal
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
  const [isProposalOpen, setIsProposalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Mock data (This would come from an API based on 'id')
  const job = {
    id: id,
    title: "React Developer for E-commerce Platform",
    category: "Web Development",
    location: "Lagos, Nigeria (Remote)",
    postedDate: "Oct 24, 2023",
    budget: "₦500,000 - ₦800,000",
    experience: "Intermediate",
    description: `We are looking for a skilled React Developer to help us finalize an e-commerce platform targeting the Nigerian market.\n\nKey requirements include Paystack integration and mobile-first responsiveness.`,
    skills: ["React", "Node.js", "Tailwind CSS", "Paystack API"]
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Navigation */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 mb-6 transition-all font-medium group"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Back to Jobs
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-sm overflow-hidden">
              <div className="h-2 bg-emerald-600 w-full" />
              <CardContent className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100 transition-colors px-4 py-1.5 rounded-full font-bold">
                    {job.category}
                  </Badge>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
                      <Share2 className="w-5 h-5 text-slate-400" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={`rounded-full transition-all ${isSaved ? 'bg-red-50' : 'hover:bg-slate-100'}`}
                      onClick={() => setIsSaved(!isSaved)}
                    >
                      <Heart className={`w-5 h-5 ${isSaved ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
                    </Button>
                  </div>
                </div>
                
                <h1 className="text-3xl font-extrabold text-slate-900 mb-6 leading-tight">{job.title}</h1>
                
                <div className="flex flex-wrap gap-y-4 gap-x-8 text-sm text-slate-500 mb-8 border-y border-slate-50 py-6">
                  <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-emerald-500" /> <span className="font-semibold text-slate-700">{job.location}</span></div>
                  <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-emerald-500" /> <span>Posted {job.postedDate}</span></div>
                  <div className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-emerald-500" /> <span>{job.experience}</span></div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3 underline decoration-emerald-500/30 decoration-4 underline-offset-4">Project Description</h3>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-line text-md">
                      {job.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map(skill => (
                        <Badge key={skill} variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-emerald-600 hover:text-white transition-all cursor-default border-none py-2 px-4 font-medium">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            <Card className="border-none shadow-xl bg-white sticky top-24">
              <CardHeader className="bg-slate-50/80 border-b border-slate-100 text-center py-8">
                <CardTitle className="text-xs uppercase tracking-[0.2em] text-slate-400 font-black">Est. Budget</CardTitle>
                <div className="text-3xl font-black text-emerald-600 mt-2">
                  {job.budget}
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <Button 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 h-14 text-lg font-black shadow-xl shadow-emerald-200 transition-all active:scale-95"
                  onClick={() => setIsProposalOpen(true)}
                >
                  Submit Proposal
                </Button>
                
                <div className="pt-6 border-t border-slate-50">
                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                    <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0" />
                    <div className="space-y-1">
                      <span className="font-bold text-xs text-slate-700 uppercase tracking-wide">Secure Payment</span>
                      <p className="text-[11px] leading-relaxed text-slate-500">
                        Funds are protected by our Escrow system. You get paid immediately upon milestone approval.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Client History Card */}
            <Card className="border-none shadow-sm bg-slate-900 text-white p-6">
              <h4 className="font-bold text-emerald-400 mb-4 flex items-center gap-2">
                About the Client
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm border-b border-white/10 pb-3">
                  <span className="text-slate-400">Rating</span>
                  <span className="font-bold text-yellow-400">★★★★★ (4.9)</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-white/10 pb-3">
                  <span className="text-slate-400">Total Spent</span>
                  <span className="font-bold">₦2.4M+</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Payment Method</span>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-none text-[10px]">VERIFIED</Badge>
                </div>
              </div>
            </Card>
          </div>

        </div>
      </div>
      
      {/* Proposal Modal Overlay */}
      <ProposalModal 
        isOpen={isProposalOpen} 
        onClose={() => setIsProposalOpen(false)} 
        jobTitle={job.title}
      />

      <Footer />
    </div>
  );
}