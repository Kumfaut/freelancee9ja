"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { toast } from "sonner";
import { Card, CardContent } from "./ui/Card";
import { Button } from "./ui/Button";
import { Progress } from "./ui/Progress";
import { Badge } from "./ui/Badge";
import { useAuth } from "../context/AuthContext";
import FundingSummaryModal from "./FundingSummaryModal";
import { 
  CheckCircle2, Wallet, Loader2, ExternalLink, 
  Plus, X,  MessageSquare 
} from "lucide-react";

export default function MilestoneTracker({ contractId }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isClient = user?.role === "client";
  
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMilestone, setNewMilestone] = useState({ title: "", amount: "", description: "" });
  
  const [showSummary, setShowSummary] = useState(false);
  const [pendingMilestone, setPendingMilestone] = useState(null);

  const fetchMilestones = useCallback(async () => {
    if (!contractId) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/contracts/${contractId}/milestones`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) setMilestones(res.data.data);
    } catch (err) {
      toast.error(t('load_error'));
    } finally {
      setLoading(false);
    }
  }, [contractId, t]);

  useEffect(() => { fetchMilestones(); }, [fetchMilestones]);

  const { totalEscrow, paidAmount, progressPercent } = useMemo(() => {
    const total = milestones.reduce((sum, m) => sum + Number(m.amount || 0), 0);
    const paid = milestones
      .filter(m => m.status === "completed")
      .reduce((sum, m) => sum + Number(m.amount || 0), 0);
    return { 
      totalEscrow: total, 
      paidAmount: paid, 
      progressPercent: total > 0 ? (paid / total) * 100 : 0 
    };
  }, [milestones]);

  const handleAction = async (endpoint, body, successKey) => {
    try {
      setProcessingId(body.milestoneId || "global");
      const token = localStorage.getItem("token");
      await axios.post(`http://localhost:5000/api/contracts/${contractId}/${endpoint}`, body, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(t(successKey));
      await fetchMilestones();
    } catch (err) {
      toast.error(err.response?.data?.message || t('error_generic'));
    } finally {
      setProcessingId(null);
    }
  };

  const confirmAndFund = async () => {
    setShowSummary(false);
    await handleAction("add-milestone", pendingMilestone, 'milestone_funded_success');
    setShowAddModal(false);
    setNewMilestone({ title: "", amount: "", description: "" });
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-emerald-500" /></div>;

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-xl bg-slate-900 text-white overflow-hidden relative rounded-[2rem]">
        <div className="absolute -top-4 -right-4 opacity-10 rotate-12">
          <Wallet className="w-32 h-32 text-white" />
        </div>
        <CardContent className="p-8 relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <Badge className="bg-emerald-500 text-slate-900 font-black text-[9px] mb-3 border-none px-2 uppercase tracking-widest">
                {t('milestone_live_escrow')}
              </Badge>
              <h2 className="text-4xl font-black tracking-tighter text-white">
                ₦{Number(totalEscrow).toLocaleString()}
              </h2>
            </div>
            {isClient && (
              <Button onClick={() => setShowAddModal(true)} className="bg-white text-slate-900 hover:bg-emerald-500 hover:text-white font-black uppercase text-[10px] tracking-widest rounded-xl transition-all">
                <Plus className="w-4 h-4 mr-2" /> {t('new_milestone')}
              </Button>
            )}
          </div>
          <div className="mt-8 space-y-3">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
              <span>{t('milestone_progress')}: ₦{Number(paidAmount).toLocaleString()} {t('milestone_paid')}</span>
              <span className="text-emerald-400">{Math.round(progressPercent)}%</span>
            </div>
            <Progress value={progressPercent} className="h-2 bg-slate-800" />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {milestones.map((m, i) => (
          <Card key={m.id} className="border-none ring-1 ring-slate-100 overflow-hidden shadow-sm bg-white rounded-2xl group">
            <CardContent className="p-0">
              <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg transition-all ${
                    m.status === 'completed' ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-50 text-slate-300'
                  }`}>
                    {m.status === 'completed' ? <CheckCircle2 size={28}/> : i + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-black text-slate-900 uppercase text-sm tracking-tight">{m.title}</h4>
                      <Badge className="text-[9px] font-black uppercase px-2 bg-slate-100 text-slate-500 border-none">
                        {t(`status_${m.status}`)}
                      </Badge>
                    </div>
                    <p className="text-lg font-black text-emerald-600 tracking-tighter">₦{Number(m.amount).toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {isClient && m.status === "pending" && (
                    <>
                      <Button onClick={() => handleAction("release-milestone", { milestoneId: m.id }, 'approve_success')} className="bg-slate-900 hover:bg-emerald-600 text-white font-black uppercase text-[10px] tracking-widest px-6 rounded-xl h-12">
                        {t('approve_pay')}
                      </Button>
                      <Button variant="outline" onClick={() => {
                        const n = prompt(t('revision_prompt'));
                        if(n) handleAction("request-revision", { milestoneId: m.id, notes: n }, 'revision_success');
                      }} className="text-red-500 border-red-100 font-black uppercase text-[10px] tracking-widest h-12 rounded-xl">
                        {t('request_revision')}
                      </Button>
                    </>
                  )}

                  {!isClient && (m.status === "funded" || m.status === "revision_requested") && (
                    <Button onClick={() => {
                      const link = prompt(t('work_link_prompt'));
                      if(link) handleAction("submit-milestone", { milestoneId: m.id, details: link }, 'submit_success');
                    }} className="bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-[10px] tracking-widest px-8 h-12 rounded-xl">
                      {processingId === m.id ? <Loader2 className="animate-spin w-4 h-4" /> : t('submit_work')}
                    </Button>
                  )}

                  {m.status === "completed" && (
                    <Button variant="ghost" onClick={() => navigate("/wallet")} className="text-emerald-600 font-black uppercase text-[10px] tracking-widest">
                      {t('view_in_wallet')}
                    </Button>
                  )}
                </div>
              </div>

              {m.status === "revision_requested" && (
                <div className="mx-6 mb-6 p-4 bg-red-50/50 rounded-2xl border border-red-100 flex gap-3">
                  <MessageSquare className="text-red-400 w-4 h-4" />
                  <p className="text-xs font-bold text-red-700"><strong>{t('revision_notes')}:</strong> {m.revision_notes}</p>
                </div>
              )}

              {m.status === "pending" && m.submission_details && isClient && (
                <div className="mx-6 mb-6 p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex justify-between items-center">
                  <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Work Submitted</p>
                  <a href={m.submission_details} target="_blank" rel="noreferrer" className="font-black text-[9px] uppercase tracking-widest flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all">
                    {t('open_work')} <ExternalLink size={12} />
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* MODAL SECTION - ADD MILESTONE */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-white border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-10">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{t('add_milestone_title')}</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-300 hover:text-slate-900 transition-colors"><X /></button>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); setPendingMilestone(newMilestone); setShowSummary(true); }} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('milestone_name')}</label>
                  <input className="w-full h-14 px-5 bg-slate-50 border-none ring-1 ring-slate-200 rounded-2xl font-bold text-slate-900" required
                    onChange={e => setNewMilestone({...newMilestone, title: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('milestone_amount')} (₦)</label>
                  <input type="number" className="w-full h-14 px-5 bg-slate-50 border-none ring-1 ring-slate-200 rounded-2xl font-black text-lg text-emerald-600" required
                    onChange={e => setNewMilestone({...newMilestone, amount: e.target.value})} />
                </div>
                <Button type="submit" className="w-full bg-slate-900 hover:bg-emerald-600 h-14 rounded-2xl text-white font-black uppercase text-[10px] tracking-widest shadow-xl transition-all">
                   {t('review_fund_btn')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      <FundingSummaryModal 
        isOpen={showSummary} 
        onClose={() => setShowSummary(false)} 
        onConfirm={confirmAndFund} 
        amount={pendingMilestone?.amount || 0} 
        title={pendingMilestone?.title || ""} 
      />
    </div>
  );
}