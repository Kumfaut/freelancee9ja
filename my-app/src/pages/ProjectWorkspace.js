"use client";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MilestoneTracker from "../components/MilestoneTracker";
import ReviewModal from "../components/ReviewModal";
import { fetchContractById } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { Loader2,  CheckCircle } from "lucide-react"; 
import { Button } from "../components/ui/Button";
import axios from "axios";
import { toast } from "sonner";

export default function ProjectWorkspace() {
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
        
        console.log("RAW API RESPONSE:", res); // Check this in your console!

        // This handles res.data OR res.data.data, and finds the first item if it's an array
        let rawData = res.data?.data || res.data; 
        const finalData = Array.isArray(rawData) ? rawData[0] : rawData;
        
        setContract(finalData);
      } catch (err) {
        console.error("Error loading workspace:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    loadProject();
  }, [contractId]);

  const handleCompleteProject = async () => {
    if (!window.confirm("Release all remaining escrow funds and close this project?")) return;

    try {
      setIsProcessing(true);
      const res = await axios.post(`http://localhost:5000/api/contracts/${contractId}/complete`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      if (res.data.success) {
        toast.success("Project completed!");
        setReviewModalOpen(true); 
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error completing project.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (val) => {
    const num = Number(val);
    return isNaN(num) ? "0" : num.toLocaleString();
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 min-h-screen bg-slate-50">
      <Loader2 className="animate-spin text-emerald-600 w-10 h-10" />
    </div>
  );

  if (error || !contract) return <div className="p-20 text-center font-bold">Workspace Not Found</div>;

  // --- IMPROVED VISIBILITY LOGIC ---
  // Add some console logs to verify it's working after the fix
const isClient = user?.role === 'client'; // Simple check for the demo
const canComplete = contract?.status === 'active' || contract?.status === 'funded' || contract?.status === 'completed';
const isActive = contract?.status === 'active' || contract?.status === 'funded';

console.log("RE-CHECK:", { 
  role: user?.role, 
  status: contract?.status, 
  showButton: isClient && isActive 
});
  return (
    <div className="min-h-screen bg-slate-50">
      <ReviewModal 
        isOpen={reviewModalOpen} 
        freelancerName={contract.freelancer_name || "the freelancer"} 
        onSubmit={async (reviewData) => {
          try {
            await axios.post("http://localhost:5000/api/reviews", {
              contract_id: contractId,
              reviewee_id: contract.freelancer_id,
              rating: reviewData.rating,
              comment: reviewData.comment
            }, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

            toast.success("Review saved!");
            setReviewModalOpen(false);
            navigate("/client-dashboard");
          } catch (err) {
            toast.error("Error saving review.");
          }
        }} 
      />
    
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${contract.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                {contract.status}
              </span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 leading-tight">
              {contract.job_title || "Project Workspace"}
            </h1>
          </div>

          <div className="flex gap-3">
            {/* BUTTON LOGIC UPDATED HERE */}
            {isClient && canComplete && (
              <Button 
                onClick={handleCompleteProject}
                disabled={isProcessing}
                className="bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-black transition-all px-6 py-2"
              >
                {isProcessing ? (
                  <Loader2 className="animate-spin w-4 h-4 mr-2" />
                ) : (
                  <CheckCircle className="w-4 h-4 mr-2 text-emerald-400" />
                )}
                Complete & Close Project
              </Button>
            )}
          </div>
        </div>

        {/* ... Rest of your UI remains the same ... */}
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 min-h-[400px]">
              <h2 className="text-xl font-bold text-slate-900 border-b pb-4 mb-4">Project Discussion</h2>
              <div className="h-full flex items-center justify-center text-slate-400 italic">
                Secure workspace chat active.
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[400px] space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Contract Value</p>
                <h2 className="text-3xl font-black text-emerald-600">
                  ₦{formatCurrency(contract.amount || contract.bid_amount || contract.agreed_budget)}
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