"use client";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MilestoneTracker from "../components/MilestoneTracker";
import ReviewModal from "../components/ReviewModal";
import { fetchContractById } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { Loader2, CheckCircle, Globe, ShieldCheck, MessageSquare } from "lucide-react"; 
import { Button } from "../components/ui/Button";
import axios from "axios";
import { toast } from "sonner";

export default function ProjectWorkspace() {
  const { t, i18n } = useTranslation();
  const { contractId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); 
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const loadProject = async () => {
      if (!contractId) return;
      try {
        setLoading(true);
        const res = await fetchContractById(contractId);
        let rawData = res.data?.data || res.data; 
        const finalData = Array.isArray(rawData) ? rawData[0] : rawData;
        setContract(finalData);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    loadProject();
  }, [contractId]);

  const handleCompleteProject = async () => {
    if (!window.confirm(t('complete_confirm'))) return;

    try {
      setIsProcessing(true);
      const res = await axios.post(`http://localhost:5000/api/contracts/${contractId}/complete`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      if (res.data.success) {
        toast.success(t('project_completed_toast'));
        setReviewModalOpen(true); 
      }
    } catch (err) {
      toast.error(err.response?.data?.message || t('error_generic'));
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <Loader2 className="animate-spin text-emerald-600 w-12 h-12 mb-4" />
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t('syncing_workspace')}</p>
    </div>
  );

  if (error || !contract) return <div className="p-20 text-center font-black uppercase text-slate-400">{t('workspace_not_found')}</div>;

  const isClient = user?.role === 'client';
  const canComplete = ['active', 'funded'].includes(contract?.status);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <ReviewModal 
        isOpen={reviewModalOpen} 
        freelancerName={contract.freelancer_name || "Freelancer"} 
        onSubmit={async (reviewData) => {
          try {
            await axios.post("http://localhost:5000/api/reviews", {
              contract_id: contractId,
              reviewee_id: contract.freelancer_id,
              rating: reviewData.rating,
              comment: reviewData.comment
            }, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
            toast.success(t('review_saved_toast'));
            setReviewModalOpen(false);
            navigate("/client-dashboard");
          } catch (err) { toast.error(t('error_generic')); }
        }} 
      />

      {/* Workspace Header */}
      <div className="bg-white border-b border-slate-200 py-6 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-50 p-3 rounded-2xl">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Project #{contractId.slice(-6)}</span>
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                        {contract.status}
                    </span>
                </div>
                <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none mt-1">
                    {contract.job_title || t('workspace_title')}
                </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <div className="flex items-center gap-1 bg-slate-50 px-3 py-2 rounded-xl ring-1 ring-slate-200 mr-2">
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
            {isClient && canComplete && (
              <Button 
                onClick={handleCompleteProject}
                disabled={isProcessing}
                className="bg-slate-900 hover:bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest h-12 px-6 rounded-xl shadow-xl transition-all"
              >
                {isProcessing ? <Loader2 className="animate-spin w-4 h-4" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                {t('complete_close_btn')}
              </Button>
            )}
          </div>
        </div>
      </div>
    
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Discussion Area */}
          <div className="flex-1 space-y-6">
            <div className="bg-white rounded-[2.5rem] ring-1 ring-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
              <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-500" /> {t('discussion_title')}
                </h2>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <ShieldCheck className="w-10 h-10 text-slate-200" />
                </div>
                <p className="text-slate-400 font-bold italic max-w-xs uppercase text-[10px] tracking-widest leading-loose">
                  {t('secure_chat_active')}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar: Financials & Milestones */}
          <div className="w-full lg:w-[400px] space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] ring-1 ring-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('contract_value')}</p>
                    <div className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-2 py-1 rounded">ESCROW PROTECTED</div>
                </div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter">
                  ₦{Number(contract.amount || contract.bid_amount || contract.agreed_budget).toLocaleString()}
                </h2>
            </div>
            
            <MilestoneTracker 
              totalBudget={Number(contract.amount || contract.bid_amount || contract.agreed_budget) || 0} 
              status={contract.status}
              contractId={contractId}
            />
          </div>
        </div>
      </main>
    </div>
  );
}