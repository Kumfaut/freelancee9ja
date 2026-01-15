"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MilestoneTracker from "../components/MilestoneTracker";
import { fetchContractById } from "../api/api";
import { useAuth } from "../context/AuthContext"; // Import your Auth context
import { Loader2, AlertCircle, Send, ShieldCheck } from "lucide-react";
import { Button } from "../components/ui/Button";
//import { toast } from "sonner";

export default function ProjectWorkspace() {
  const { contractId } = useParams();
  const { user } = useAuth(); // To distinguish between Client and Freelancer
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadProject = async () => {
      if (!contractId) return;
      try {
        setLoading(true);
        const res = await fetchContractById(contractId);
        setContract(res.data);
      } catch (err) {
        console.error("Error loading project workspace:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    loadProject();
  }, [contractId]);

  // SAFE BUDGET FORMATTING
  const formatCurrency = (val) => {
    const num = Number(val);
    return isNaN(num) ? "0" : num.toLocaleString();
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 min-h-screen bg-slate-50">
      <Loader2 className="animate-spin text-emerald-600 w-10 h-10" />
      <p className="mt-4 text-slate-500 font-bold text-xs uppercase tracking-widest">Opening Workspace...</p>
    </div>
  );

  if (error || !contract) return (
    <div className="flex flex-col items-center justify-center p-20 min-h-screen bg-slate-50">
      <AlertCircle className="text-red-500 w-12 h-12 mb-4" />
      <h2 className="text-xl font-black text-slate-900">Workspace Not Found</h2>
      <p className="text-slate-500 text-center max-w-xs">We couldn't find a contract with ID #{contractId}. This might happen if the contract hasn't been created yet.</p>
    </div>
  );

  const isClient = user?.role === "client";

  return (
    <div className="min-h-screen bg-slate-50">
    
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                contract.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {contract.status}
              </span>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Contract #{contractId}</p>
            </div>
            <h1 className="text-3xl font-black text-slate-900 leading-tight">
              {contract.job_title || contract.title || "Project Workspace"}
            </h1>
            <p className="text-slate-500 font-medium">
              Work with <span className="text-emerald-600 font-bold">{isClient ? contract.freelancer_name : contract.client_name}</span>
            </p>
          </div>

          {/* ACTION BUTTONS (Role Based) */}
          <div className="flex gap-3">
            {!isClient && contract.status === 'active' && (
              <Button className="bg-emerald-600 font-bold rounded-xl shadow-lg shadow-emerald-100">
                <Send className="w-4 h-4 mr-2" /> Submit Work
              </Button>
            )}
            {isClient && contract.status === 'active' && (
              <Button variant="outline" className="border-slate-200 font-bold rounded-xl bg-white">
                <ShieldCheck className="w-4 h-4 mr-2 text-blue-500" /> Release Payment
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Side: Discussion & Submissions */}
          <div className="flex-1 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 min-h-[400px] flex flex-col">
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4 mb-4">Project Discussion</h2>
              <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
                 <p className="text-sm font-medium italic">Message history will appear here.</p>
              </div>
              
              {/* Message Input Placeholder */}
              <div className="mt-4 flex gap-2">
                <input 
                  type="text" 
                  placeholder="Type a message..." 
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
                <Button className="bg-slate-900 h-10 w-10 p-0 rounded-xl">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Right Side: Financials & Milestones */}
          <div className="w-full lg:w-[400px] space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Contract Value</p>
                {/* FIX: Use helper function to prevent NaN */}
                <h2 className="text-3xl font-black text-emerald-600">
                  ₦{formatCurrency(contract.amount || contract.bid_amount)}
                </h2>
            </div>
            
            <MilestoneTracker 
              totalBudget={Number(contract.amount || contract.bid_amount) || 0} 
              status={contract.status}
              contractId={contractId}
            />
          </div>

        </div>
      </main>
    </div>
  );
}