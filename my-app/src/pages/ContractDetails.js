"use client";

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchContractById, submitWork } from "../api/api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { 
  FileText, ShieldCheck, MessageSquare, 
  Clock, CheckCircle, ChevronLeft,
  ExternalLink, Loader2
} from "lucide-react";
import { toast } from "sonner";

export default function ContractDetails() {
  const { contractId } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const getDetails = async () => {
      try {
        const res = await fetchContractById(contractId);
        setContract(res.data);
      } catch (err) {
        toast.error("Could not load contract details");
      } finally {
        setLoading(false);
      }
    };
    getDetails();
  }, [contractId]);

  // --- SUBMISSION LOGIC ---
  const handleSubmitWork = async () => {
    const note = prompt("Enter a brief note about your submission:");
    const link = prompt("Paste the link to your work (e.g., Google Drive, GitHub, or Cloud link):");

    if (!link) return;

    try {
      setIsSubmitting(true);
      await submitWork(contract.id, { 
        submission_notes: note, 
        submission_link: link 
      });
      toast.success("Work submitted successfully! The client has been notified.");
      
      // Refresh local state to show the submission
      const updated = await fetchContractById(contractId);
      setContract(updated.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
    </div>
  );
  
  if (!contract) return <div className="p-20 text-center font-bold">Contract not found.</div>;

  const isCompleted = contract.status === 'completed';

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10">
      <div className="max-w-5xl mx-auto px-4">
        
        {/* Navigation */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-slate-500 mb-8 hover:text-emerald-600 font-semibold transition-colors group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> 
          Back to Dashboard
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Project Header Card */}
            <Card className="border-none shadow-sm ring-1 ring-slate-200 overflow-hidden">
              <div className={`h-1.5 w-full ${isCompleted ? 'bg-blue-500' : 'bg-emerald-500'}`} />
              <CardHeader className="bg-white pb-2">
                <div className="flex justify-between items-center mb-2">
                  <Badge className={`${isCompleted ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'} border-none px-3 py-1 text-[10px] font-black uppercase tracking-widest`}>
                    {isCompleted ? "Pending Client Review" : "Active Contract"}
                  </Badge>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Ref: #{contract.id}</span>
                </div>
                <CardTitle className="text-3xl font-black text-slate-900 leading-tight">
                  {contract.job_title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="prose prose-slate max-w-none">
                  <h4 className="text-sm font-bold text-slate-400 uppercase mb-3 tracking-widest">Project Description</h4>
                  <p className="text-slate-600 text-base leading-relaxed whitespace-pre-line bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                    {contract.job_description}
                  </p>
                </div>
                
                {/* Action Buttons */}
                {!isCompleted && (
                  <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap gap-4">
                    <Button 
                      disabled={isSubmitting}
                      onClick={handleSubmitWork}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 px-6 shadow-lg shadow-emerald-100"
                    >
                      {isSubmitting ? <Loader2 className="animate-spin" /> : <CheckCircle className="w-5 h-5 mr-2" />}
                      Submit Final Work
                    </Button>
                    <Button variant="outline" className="h-12 px-6 border-slate-200 font-bold text-slate-600">
                      <MessageSquare className="w-5 h-5 mr-2" /> Message Client
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submission Preview (Shows after work is submitted) */}
            {isCompleted && (
              <Card className="border-none shadow-sm ring-1 ring-blue-500/20 bg-blue-50/30">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-500 rounded-lg text-white">
                      <FileText className="w-5 h-5" />
                    </div>
                    <h3 className="font-black text-slate-900">Your Submission</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-xl border border-blue-100">
                       <p className="text-xs font-bold text-slate-400 uppercase mb-1">Freelancer's Note</p>
                       <p className="text-slate-700 text-sm">{contract.submission_notes || "No notes provided."}</p>
                    </div>
                    <a 
                      href={contract.submission_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-white rounded-xl border border-blue-100 hover:border-blue-300 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <ExternalLink className="w-5 h-5 text-blue-500" />
                        <span className="text-sm font-bold text-blue-600">View Submitted Work</span>
                      </div>
                      <ChevronLeft className="w-4 h-4 rotate-180 text-slate-300" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar: Status & Financials */}
          <div className="space-y-6">
            <Card className="border-none shadow-xl bg-white ring-1 ring-slate-200">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-6">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Contract Value</p>
                 <div className="text-4xl font-black text-emerald-600 mt-2 text-center leading-none">
                  ₦{Number(contract.amount).toLocaleString()}
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" /> Payment
                  </span>
                  <Badge variant="outline" className="border-emerald-200 text-emerald-700 bg-emerald-50/50 font-bold uppercase text-[9px]">
                    {contract.payment_status}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" /> Started On
                  </span>
                  <span className="text-xs font-black text-slate-700">
                    {new Date(contract.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                  </span>
                </div>

                <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                  <div className="flex gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                    <p className="text-[11px] leading-snug text-emerald-800">
                      <strong>Payment Protected:</strong> This amount is held securely in our Escrow. Funds are released to the freelancer once work is approved.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Counterpart Card */}
            <Card className="border-none shadow-sm ring-1 ring-slate-200 bg-white">
               <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center border border-slate-200">
                    <UserIcon className="w-6 h-6 text-slate-400" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">Client Information</p>
                    <p className="text-base font-bold text-slate-900 truncate">{contract.client_name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{contract.client_email}</p>
                  </div>
               </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}

// Simple placeholder for the user icon
function UserIcon(props) {
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}