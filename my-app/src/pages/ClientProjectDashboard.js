"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  ShieldCheck, Users, Clock,  ChevronLeft, MessageCircle, ExternalLink, Loader2
} from "lucide-react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchJobById, fetchProposalsByJob, hireFreelancer } from "../api/api";
import { io } from "socket.io-client";
import { toast } from "sonner";

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Avatar, AvatarFallback } from "../components/ui/Avatar";

// Initialize socket
const socket = io("http://localhost:5000", { transports: ["websocket"] });

export default function ClientProjectDashboard({ defaultTab = "proposals" }) {
  const { projectId } = useParams(); // This matches the :projectId in your App.js route
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [project, setProject] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isHiring, setIsHiring] = useState(false);

  // --- 1. DATA SYNC LOGIC ---
  const loadProjectData = useCallback(async () => {
    try {
      setLoading(true);
      const [jobRes, propRes] = await Promise.all([
        fetchJobById(projectId),
        fetchProposalsByJob(projectId)
      ]);

      setProject(jobRes.data);
      // Ensure we handle different backend response shapes
      setProposals(Array.isArray(propRes.data) ? propRes.data : propRes.data.proposals || []);
    } catch (err) {
      console.error("Sync Error:", err);
      toast.error("Failed to sync project data");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (!isLoggedIn || user?.role !== "client") return;

    loadProjectData();

    // Join Real-time room
    socket.emit("join_job_management", projectId);

    socket.on("new_proposal_received", (newProposal) => {
      setProposals((prev) => [newProposal, ...prev]);
      toast.success(`New proposal from ${newProposal.full_name}!`);
    });

    return () => {
      socket.off("new_proposal_received");
    };
  }, [projectId, isLoggedIn, user, loadProjectData]);

  // --- 2. ACTIONS ---
const handleHire = async (proposal) => {
  const confirmHire = window.confirm(`Hire ${proposal.full_name} for ₦${Number(proposal.bid_amount).toLocaleString()}?`);
  if (!confirmHire) return;

  try {
    setIsHiring(true);
    
    // 1. Capture the response (res) from the backend
    const res = await hireFreelancer({
      job_id: projectId,
      freelancer_id: proposal.freelancer_id,
      proposal_id: proposal.id,
      amount: proposal.bid_amount,
      title: project.title
    });
    const newContractId = res.data.contractId;
    toast.success("Hired successfully! Escrow initiated.");


    if (newContractId) {
      // 3. Navigate directly to the new contract workspace
      navigate(`/workspace/${newContractId}`);
    } else {
      navigate("/client-dashboard");
    }

  } catch (err) {
    console.error("Hiring error:", err);
    toast.error(err.response?.data?.message || "Hiring failed");
  } finally {
    setIsHiring(false);
  }
};

  // Guard Clauses
  if (!isLoggedIn) return <Navigate to="/login" />;
  if (user.role !== "client") return <Navigate to="/dashboard" />;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mx-auto mb-4" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Fetching Live Data</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
        
        <button 
          onClick={() => navigate("/client-dashboard")}
          className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-bold text-xs transition-colors mb-2"
        >
          <ChevronLeft size={14} /> Back to Manage Jobs
        </button>

        {/* Header Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge className="bg-emerald-50 text-emerald-700 border-none text-[10px] font-black uppercase tracking-widest px-3 py-1">
                {project?.status || "Open"}
              </Badge>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">ID: #{projectId}</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 leading-tight">{project?.title}</h1>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button variant="outline" className="flex-1 md:flex-none text-xs font-bold border-slate-200 h-10 px-5">Edit Post</Button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-200/50 p-1.5 rounded-2xl w-fit">
          <TabButton 
            active={activeTab === "proposals"} 
            onClick={() => setActiveTab("proposals")}
            icon={<Users size={14} />}
            label="Applicants"
            count={proposals.length}
          />
          <TabButton 
            active={activeTab === "milestones"} 
            onClick={() => setActiveTab("milestones")}
            icon={<Clock size={14} />}
            label="Escrow & Milestones"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {activeTab === "proposals" ? (
              <div className="space-y-4">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Received Proposals</h3>
                
                {proposals.length === 0 ? (
                  <div className="bg-white p-12 text-center rounded-3xl border border-slate-100">
                    <Users className="mx-auto text-slate-200 mb-4" size={48} />
                    <p className="text-slate-500 font-bold">No applicants yet. Keep an eye out!</p>
                  </div>
                ) : (
                  proposals.map((prop) => (
                    <Card key={prop.id} className="border-slate-200 shadow-sm hover:shadow-md transition-all group">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex gap-4">
                            <Avatar className="h-14 w-14 rounded-xl border-2 border-white shadow-sm">
                              <AvatarFallback className="bg-emerald-600 text-white font-black text-lg">
                                {prop.full_name?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-black text-slate-900 group-hover:text-emerald-600 transition-colors">{prop.full_name}</h4>
                              <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter">{prop.freelancer_title || 'Freelancer'}</p>
                              <div className="bg-slate-50 p-3 rounded-lg mt-2 border border-slate-100 italic text-slate-600 text-xs">
                                "{prop.cover_letter?.substring(0, 100)}..."
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                              <div className="text-lg font-black text-slate-900">₦{Number(prop.bid_amount).toLocaleString()}</div>
                              <p className="text-[10px] text-slate-400 font-bold uppercase">Total Bid</p>
                              <p className="text-[10px] text-emerald-600 font-black mt-1 uppercase">{prop.delivery_days} Days</p>
                          </div>
                        </div>
                        <div className="mt-6 flex gap-3">
                          <Button 
                            disabled={isHiring}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 font-black text-xs h-11 shadow-lg shadow-emerald-100" 
                            onClick={() => handleHire(prop)}
                          >
                            {isHiring ? <Loader2 className="animate-spin" /> : "Hire & Fund Escrow"}
                          </Button>
                          <Button 
                            variant="outline" 
                            className="text-xs font-black border-slate-200 h-11 px-6"
                            onClick={() => navigate(`/messages?user=${prop.freelancer_id}`)}
                          >
                            <MessageCircle size={16} className="mr-2" /> Chat
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Active Milestones</h3>
                <p className="text-slate-400 text-xs font-bold p-10 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                  Fund a freelancer to start tracking milestones.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-none bg-slate-900 text-white shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <ShieldCheck size={80} />
              </div>
              <CardHeader className="relative z-10">
                <CardTitle className="text-sm flex items-center gap-2 font-black uppercase tracking-widest text-emerald-400">
                  <ShieldCheck size={18}/> Payment Security
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-xs text-slate-400 leading-relaxed font-medium mb-6">
                  NaijaTrust Escrow holds your funds safely. Only release payment when you are 100% satisfied with the work.
                </p>
                <div className="pt-6 border-t border-slate-800 flex justify-between items-end font-black">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Project Budget</p>
                    <span className="text-emerald-400 text-2xl tracking-tighter">
                      ₦{Number(project?.budget).toLocaleString()}
                    </span>
                  </div>
                  <ExternalLink size={16} className="text-slate-600 mb-1" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label, count }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
        active ? "bg-white text-emerald-600 shadow-sm ring-1 ring-slate-200" : "text-slate-500 hover:text-slate-800"
      }`}
    >
      {icon} {label}
      {count !== undefined && (
        <span className={`ml-1 px-1.5 py-0.5 rounded-md text-[10px] ${active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
          {count}
        </span>
      )}
    </button>
  );
}