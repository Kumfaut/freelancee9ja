"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { fetchProposalsByJob, fetchJobById, hireFreelancer } from "../api/api"; 
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { 
  ChevronLeft, Mail, Clock, 
  DollarSign, User, Loader2, CheckCircle2,
  TrendingUp
} from "lucide-react";
import { toast } from "sonner";

// Initialize socket outside component to prevent multiple connections
const socket = io("http://localhost:5000", { transports: ["websocket"] });

export default function ManageProposals() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  
  const [proposals, setProposals] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hiringId, setHiringId] = useState(null);

  // --- REAL-TIME DATA HANDLING ---
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      // 1. Fetch data
      const [jobRes, propRes] = await Promise.all([
        fetchJobById(jobId),
        fetchProposalsByJob(jobId)
      ]);
  
      // 2. Log exactly what the server is sending (Check your browser console!)
      console.log("Server Proposal Data:", propRes.data);
  
      // 3. Update Job details
      setJob(jobRes.data);
  
      // 4. Update Proposals (Handling both array and object responses)
      const proposalsArray = Array.isArray(propRes.data) 
        ? propRes.data 
        : propRes.data.proposals || [];
        
      setProposals(proposalsArray);
  
    } catch (err) {
      console.error("Fetch Error:", err);
      toast.error("Failed to load applicants");
      setProposals([]); // Clear demo data on error
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    loadData();

    // Join Job-Specific Management Room
    socket.emit("join_job_management", jobId);

    // Listen for new proposals in real-time
    socket.on("new_proposal_received", (newProposal) => {
      setProposals((prev) => {
        // Prevent duplicates
        if (prev.find(p => p.id === newProposal.id)) return prev;
        toast.info(`New proposal from ${newProposal.full_name}!`);
        return [newProposal, ...prev];
      });
    });

    return () => {
      socket.off("new_proposal_received");
      socket.emit("leave_job_management", jobId);
    };
  }, [jobId, loadData]);

  // --- ACTIONS ---
  const handleHire = async (proposal) => {
    if (!window.confirm(`Hire ${proposal.full_name} for ₦${Number(proposal.bid_amount).toLocaleString()}?`)) return;

    try {
      setHiringId(proposal.id);
      await hireFreelancer({
        job_id: proposal.job_id,
        freelancer_id: proposal.freelancer_id,
        proposal_id: proposal.id,
        amount: proposal.bid_amount
      }); 

      toast.success("Freelancer hired! Contract initiated.");
      navigate("/client-dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error finalizing hire.");
    } finally {
      setHiringId(null);
    }
  };

  const handleOpenChat = (freelancerId) => {
    // Navigate to chat with this specific freelancer
    // Assumes your chat route handles user redirection
    navigate(`/messages?user=${freelancerId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50/50">
        <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mb-4" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Syncing Applicants</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* TOP NAV BAR */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 font-bold text-sm hover:text-emerald-600">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400">Live Management</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-10">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Badge className="bg-emerald-600 text-white border-none px-3 py-1 rounded-md">Project #{jobId}</Badge>
              <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Active Hiring</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Applicants for <span className="text-emerald-600 underline decoration-emerald-200">{job?.title}</span>
            </h1>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="bg-emerald-50 p-3 rounded-xl">
              <TrendingUp className="text-emerald-600 w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase">Total Bids</p>
              <p className="text-xl font-black text-slate-900">{proposals.length}</p>
            </div>
          </div>
        </div>

        {/* PROPOSALS LIST */}
        <div className="grid gap-6">
          {proposals.length === 0 ? (
            <div className="bg-white rounded-[2.5rem] p-20 text-center border-2 border-dashed border-slate-200">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="text-slate-200 w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">No Applications Yet</h2>
              <p className="text-slate-500 font-medium">Sit tight! We're notifying the best freelancers for your job.</p>
            </div>
          ) : (
            proposals.map((prop) => (
              <Card key={prop.id} className="group border-none shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-[2rem] overflow-hidden bg-white">
                <CardContent className="p-0">
                  <div className="flex flex-col lg:flex-row">
                    
                    {/* AVATAR & INFO */}
                    <div className="p-8 flex-1">
                      <div className="flex items-start gap-5 mb-6">
                        <div className="w-16 h-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white font-black text-2xl shadow-lg">
                          {prop.full_name?.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-2xl font-black text-slate-900">{prop.full_name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                             <CheckCircle2 className="w-4 h-4 text-blue-500 fill-blue-50" />
                             <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{prop.freelancer_title || "Freelancer"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100 mb-6 group-hover:bg-emerald-50/30 transition-colors">
                        <p className="text-slate-600 font-medium leading-relaxed italic">
                          "{prop.cover_letter}"
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
                          <DollarSign className="w-4 h-4 text-emerald-600" />
                          <span className="text-sm font-black text-slate-900">₦{Number(prop.bid_amount).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
                          <Clock className="w-4 h-4 text-emerald-600" />
                          <span className="text-sm font-black text-slate-900">{prop.delivery_days || prop.timeline} Days</span>
                        </div>
                      </div>
                    </div>

                    {/* ACTIONS SIDEBAR */}
                    <div className="bg-slate-50 lg:w-64 p-8 flex flex-col justify-center gap-3 border-t lg:border-t-0 lg:border-l border-slate-100">
                      <Button 
                        disabled={hiringId !== null}
                        onClick={() => handleHire(prop)}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 h-14 rounded-2xl text-white font-black uppercase tracking-widest shadow-lg shadow-emerald-100"
                      >
                        {hiringId === prop.id ? <Loader2 className="animate-spin" /> : "Hire Me"}
                      </Button>
                      
                      <Button 
                        variant="outline"
                        onClick={() => handleOpenChat(prop.freelancer_id)}
                        className="w-full h-14 rounded-2xl border-slate-200 bg-white font-black text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all"
                      >
                        <Mail className="w-4 h-4 mr-2" /> Message
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}