"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Card, CardContent } from "./ui/Card";
import { Button } from "./ui/Button";
import { Progress } from "./ui/Progress";
import { Badge } from "./ui/Badge";
import { useAuth } from "../context/AuthContext";
import FundingSummaryModal from "./FundingSummaryModal"; // Ensure path is correct
import { 
  CheckCircle2, 
  Wallet, 
  Loader2, 
  ExternalLink, 
  Plus, 
  X,
  AlertTriangle,
  MessageSquare
} from "lucide-react";

export default function MilestoneTracker({ contractId }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isClient = user?.role === "client";
  
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMilestone, setNewMilestone] = useState({ title: "", amount: "", description: "" });
  
  // Modal States
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
      toast.error("Failed to load milestones");
    } finally {
      setLoading(false);
    }
  }, [contractId]);

  useEffect(() => {
    fetchMilestones();
  }, [fetchMilestones]);

  const { totalEscrow, paidAmount, progressPercent } = useMemo(() => {
    const total = milestones.reduce((sum, m) => sum + Number(m.amount || 0), 0);
    const paid = milestones
      .filter(m => m.status === "completed")
      .reduce((sum, m) => sum + Number(m.amount || 0), 0);
    const percent = total > 0 ? (paid / total) * 100 : 0;
    
    return { totalEscrow: total, paidAmount: paid, progressPercent: percent };
  }, [milestones]);

  const handleAction = async (endpoint, body, successMsg) => {
    try {
      setProcessingId(body.milestoneId || "global");
      const token = localStorage.getItem("token");
      await axios.post(`http://localhost:5000/api/contracts/${contractId}/${endpoint}`, body, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(successMsg);
      await fetchMilestones();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setProcessingId(null);
    }
  };

  const handleAddMilestoneClick = (e) => {
    e.preventDefault();
    setPendingMilestone(newMilestone);
    setShowSummary(true);
  };
  
  const confirmAndFund = async () => {
    setShowSummary(false);
    await handleAction("add-milestone", pendingMilestone, "Milestone created & funded!");
    setShowAddModal(false);
    setNewMilestone({ title: "", amount: "", description: "" });
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-emerald-500" /></div>;

  return (
    <div className="space-y-6">
      {/* HEADER CARD */}
      <Card className="border-none shadow-2xl bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Wallet className="w-24 h-24 text-white" />
        </div>
        <CardContent className="p-8 relative z-10">
          <div className="flex justify-between items-center gap-4">
            <div>
              <Badge className="bg-emerald-500/20 text-emerald-400 mb-2 border-none">LIVE ESCROW</Badge>
              <h2 className="text-4xl font-black tracking-tight text-white">
                ₦{Number(totalEscrow).toLocaleString()}
              </h2>
            </div>
            {isClient && (
              <Button onClick={() => setShowAddModal(true)} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold">
                <Plus className="w-4 h-4 mr-2" /> New Milestone
              </Button>
            )}
          </div>
          <div className="mt-8 space-y-2">
            <div className="flex justify-between text-xs font-bold uppercase text-slate-400">
              <span>Progress: ₦{Number(paidAmount).toLocaleString()} Paid</span>
              <span className="text-emerald-400">{Math.round(progressPercent)}%</span>
            </div>
            <Progress value={progressPercent} className="h-2 bg-slate-800" />
          </div>
        </CardContent>
      </Card>

      {/* MILESTONE LISTING */}
      <div className="space-y-4">
        {milestones.map((m, i) => (
          <Card key={m.id} className="border-none ring-1 ring-slate-200 overflow-hidden shadow-sm bg-white">
            <CardContent className="p-0 text-slate-900">
              <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${
                    m.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {m.status === 'completed' ? <CheckCircle2 size={24}/> : i + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold">{m.title}</h4>
                      <Badge variant="outline" className="text-[10px] uppercase px-1 h-4">
                        {m.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm font-bold text-emerald-600">₦{Number(m.amount).toLocaleString()}</p>
                    {m.description && <p className="text-xs text-slate-500 italic mt-1">{m.description}</p>}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {isClient && m.status === "pending" && (
                    <>
                      <Button size="sm" onClick={() => handleAction("release-milestone", { milestoneId: m.id }, "Payment released!")} className="bg-slate-900 text-white font-bold px-4">
                        Approve & Pay
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => {
                        const n = prompt("What needs to be fixed?");
                        if(n) handleAction("request-revision", { milestoneId: m.id, notes: n }, "Revision requested");
                      }} className="text-red-600 border-red-200 hover:bg-red-50">
                        Revision
                      </Button>
                    </>
                  )}

                  {!isClient && (m.status === "funded" || m.status === "revision_requested") && (
                    <Button size="sm" onClick={() => {
                      const link = prompt("Paste your work link:");
                      if(link) handleAction("submit-milestone", { milestoneId: m.id, details: link }, "Work submitted!");
                    }} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6">
                      {processingId === m.id ? <Loader2 className="animate-spin w-4 h-4" /> : "SUBMIT WORK"}
                    </Button>
                  )}

                  {m.status === "pending" && (
                    <Button size="sm" variant="ghost" onClick={() => {
                      const r = prompt("Reason for dispute:");
                      if(r) handleAction("dispute-milestone", { milestoneId: m.id, reason: r }, "Dispute opened");
                    }} className="text-orange-600 hover:bg-orange-50">
                      <AlertTriangle size={14} className="mr-1" /> Dispute
                    </Button>
                  )}

                  {m.status === "completed" && (
                    <Button variant="ghost" size="sm" onClick={() => navigate("/wallet")} className="text-emerald-600 font-bold">
                      View in Wallet
                    </Button>
                  )}
                </div>
              </div>

              {/* Status Messages */}
              {m.status === "revision_requested" && m.revision_notes && (
                <div className="mx-5 mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-100 flex gap-2">
                  <MessageSquare size={14} />
                  <span><strong>Revision Notes:</strong> {m.revision_notes}</span>
                </div>
              )}

              {m.status === "disputed" && (
                <div className="mx-5 mb-4 p-3 bg-orange-50 text-orange-800 text-xs rounded-xl border border-orange-200 flex gap-2 animate-pulse">
                  <AlertTriangle size={14} />
                  <span><strong>Dispute Active:</strong> An admin is currently reviewing this milestone.</span>
                </div>
              )}

              {m.status === "pending" && m.submission_details && isClient && (
                <div className="mx-5 mb-4 p-3 bg-blue-50 text-blue-700 text-xs rounded-xl border border-blue-100 flex justify-between items-center">
                  <span>Work has been submitted for review.</span>
                  <a href={m.submission_details} target="_blank" rel="noreferrer" className="font-bold flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700">
                    OPEN WORK <ExternalLink size={12} />
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ADD MILESTONE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-white border-none shadow-2xl">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">Add Milestone</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600"><X /></button>
              </div>
              <form onSubmit={handleAddMilestoneClick} className="space-y-4 text-slate-900">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Title</label>
                  <input className="w-full p-3 bg-slate-50 border rounded-xl mt-1 text-slate-900" required placeholder="e.g., UI Design"
                    onChange={e => setNewMilestone({...newMilestone, title: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Amount (₦)</label>
                  <input type="number" className="w-full p-3 bg-slate-50 border rounded-xl mt-1 text-slate-900" required placeholder="5000"
                    onChange={e => setNewMilestone({...newMilestone, amount: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Deliverables</label>
                  <textarea className="w-full p-3 bg-slate-50 border rounded-xl mt-1 h-24 text-slate-900" placeholder="What will be delivered?"
                    onChange={e => setNewMilestone({...newMilestone, description: e.target.value})} />
                </div>
                <Button type="submit" disabled={processingId === "global"} className="w-full bg-slate-900 text-white font-bold h-12">
                   {processingId === "global" ? <Loader2 className="animate-spin" /> : "Review & Fund Milestone"}
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