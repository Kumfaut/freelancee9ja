"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Hook is used below now
import axios from "axios";
import { toast } from "sonner";
import { Card, CardContent } from "./ui/Card";
import { Button } from "./ui/Button";
import { Progress } from "./ui/Progress";
import { Badge } from "./ui/Badge";
import { useAuth } from "../context/AuthContext";
import { 
  ShieldCheck, Lock, CheckCircle2, 
  ArrowRight, Wallet, Loader2
} from "lucide-react";

export default function MilestoneTracker({ totalBudget = 0, contractId }) {
  const navigate = useNavigate(); // ESLint warning fixed by using this below
  const { user } = useAuth();
  const isClient = user?.role === "client";
  const [processingId, setProcessingId] = useState(null);

  const safeTotal = Number(totalBudget) || 0;

  // In production, these would be fetched from the DB
  const [milestones, setMilestones] = useState([
    { id: 1, title: "Initial Setup & Research", amount: safeTotal * 0.30, status: "completed" },
    { id: 2, title: "Main Project Phase", amount: safeTotal * 0.70, status: "funded" },
  ]);

  const handleReleasePayment = async (milestoneId) => {
    try {
      setProcessingId(milestoneId);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:5000/api/contracts/${contractId}/release-milestone`, 
        { milestoneId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success("Payment released to freelancer's wallet!");
        setMilestones(prev => prev.map(m => m.id === milestoneId ? {...m, status: 'completed'} : m));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to release payment");
    } finally {
      setProcessingId(null);
    }
  };

  const handleSubmitWork = async (milestoneId) => {
    const workLink = prompt("Please enter the link to your work (e.g., Google Drive or GitHub):");
    if (!workLink) return;
  
    try {
      setProcessingId(milestoneId);
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/contracts/${contractId}/submit-milestone`, 
        { milestoneId, details: workLink }, // Passing 'details' to backend
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Work submitted for review!");
    } catch (err) {
      toast.error("Failed to submit work");
    } finally {
      setProcessingId(null);
    }
  };

  const completedAmount = milestones
    .filter(m => m.status === "completed")
    .reduce((sum, m) => sum + m.amount, 0);

  const progressPercent = safeTotal > 0 ? (completedAmount / safeTotal) * 100 : 0;

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-xl bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Wallet className="w-24 h-24" />
        </div>
        <CardContent className="p-6 relative z-10">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">NaijaTrust Escrow Active</p>
              </div>
              <h2 className="text-3xl font-black">₦{safeTotal.toLocaleString()}</h2>
              <p className="text-slate-400 text-xs font-medium">Project Value Securely Held</p>
            </div>
            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          
          <div className="mt-8 space-y-3">
            <div className="flex justify-between items-end text-[10px] font-black uppercase">
              <span className="text-slate-400">Payout Progress</span>
              <span className="text-emerald-400">{Math.round(progressPercent)}%</span>
            </div>
            <Progress value={progressPercent} className="h-2 bg-white/5" />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {milestones.map((m, index) => (
          <Card key={m.id} className="border-none shadow-sm ring-1 ring-slate-200/50 overflow-hidden group">
            <CardContent className="p-0">
              <div className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${
                    m.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-50 text-slate-300'
                  }`}>
                    {m.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{m.title}</h4>
                    <p className="text-xs text-slate-500 font-bold">₦{m.amount.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {m.status === "completed" && (
                    <Badge className="bg-emerald-50 text-emerald-700 border-none px-3 py-1 font-black text-[10px] uppercase">Released</Badge>
                  )}
                  
                  {m.status === "funded" && (
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-50 text-blue-700 border-none px-3 py-1 font-black text-[10px] uppercase flex gap-1 items-center">
                        <Lock className="w-3 h-3" /> Funded
                      </Badge>
                      
                      {isClient ? (
                        <Button 
                          onClick={() => handleReleasePayment(m.id)} 
                          disabled={processingId === m.id}
                          size="sm" className="bg-slate-900 hover:bg-emerald-600 h-8 text-[10px] font-black uppercase rounded-lg"
                        >
                          {processingId === m.id ? <Loader2 className="animate-spin w-3 h-3" /> : "Approve & Pay"}
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => handleSubmitWork(m.id)}
                          disabled={processingId === m.id}
                          size="sm" className="bg-emerald-600 hover:bg-emerald-700 h-8 text-[10px] font-black uppercase rounded-lg"
                        >
                          {processingId === m.id ? <Loader2 className="animate-spin w-3 h-3" /> : "Submit Work"}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* SUCCESS BANNER - Uses 'navigate' to fix ESLint error */}
              {m.status === "completed" && (
                <div 
                  className="bg-emerald-50/50 px-4 py-2 border-t border-emerald-100/50 flex justify-between items-center cursor-pointer hover:bg-emerald-50 transition-colors" 
                  onClick={() => navigate("/wallet")} 
                >
                  <p className="text-[10px] text-emerald-700 font-bold uppercase flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Transaction Verified
                  </p>
                  <span className="text-[10px] font-black text-emerald-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    {isClient ? "VIEW RECEIPT" : "VIEW WALLET"} <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}