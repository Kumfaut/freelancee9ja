"use client";

import React, { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import { 
  fetchRecommendedJobs, 
  fetchUserContracts 
} from "../api/api";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/Tabs";
//import { Progress } from "../components/ui/Progress";
import { 
  Bell, Briefcase, DollarSign, Star, 
  TrendingUp, Search, ExternalLink, 
  Loader2, Sparkles, ArrowRight 
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

// --- SUB-COMPONENT: RECOMMENDED JOBS ---
function RecommendedJobsSection() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadRecommended = async () => {
      try {
        const res = await fetchRecommendedJobs();
        setJobs(res.data.data || []);
      } catch (err) {
        console.error("Failed to load recommendations", err);
      } finally {
        setLoading(false);
      }
    };
    loadRecommended();
  }, []);

  if (loading) return (
    <div className="flex justify-center py-8"><Loader2 className="animate-spin text-emerald-600" /></div>
  );

  if (!loading && jobs.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-100 rounded-lg">
            <Sparkles className="w-5 h-5 text-amber-600 fill-amber-600" />
          </div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
            Matches for your skills
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {jobs.slice(0, 3).map((job) => (
          <Card 
            key={job.id} 
            className="group cursor-pointer border-none shadow-sm hover:shadow-md transition-all ring-1 ring-slate-200 bg-white rounded-2xl overflow-hidden"
            onClick={() => navigate(`/job/${job.id}`)}
          >
            <CardContent className="p-5">
              <Badge className="mb-3 bg-slate-100 text-slate-600 border-none font-bold text-[9px] uppercase tracking-tighter">
                {job.category?.replace(/-/g, ' ') || "General"}
              </Badge>
              <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
                {job.title}
              </h3>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-black text-slate-900">
                  ₦{Number(job.budget_max || job.budget).toLocaleString()}
                </span>
                <div className="p-2 rounded-full bg-slate-50 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// --- MAIN DASHBOARD COMPONENT ---
export default function FreelancerDashboard() {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  
  const [activeContracts, setActiveContracts] = useState([]);
  const [liveStats, setLiveStats] = useState({ totalEarnings: 0, rating: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Fetch both contracts and the new live stats API
        const [contractsRes, statsRes] = await Promise.all([
          fetchUserContracts(),
          axios.get("http://localhost:5000/api/users/stats", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
          })
        ]);
        
        setActiveContracts(contractsRes.data || []);
        setLiveStats(statsRes.data);
      } catch (err) {
        console.error("Dashboard data error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (isLoggedIn) loadDashboardData();
  }, [isLoggedIn]);

  if (!isLoggedIn) return <Navigate to="/login" />;
  if (user?.role !== "freelancer") return <Navigate to="/client-dashboard" />;

  const stats = [
    { 
      label: "Total Earnings", 
      val: `₦${Number(liveStats.totalEarnings || 0).toLocaleString()}`, 
      icon: <DollarSign className="text-emerald-600 w-5 h-5"/>, 
      bg: "bg-emerald-100" 
    },
    { 
      label: "Active Jobs", 
      val: activeContracts.length, 
      icon: <Briefcase className="text-blue-600 w-5 h-5"/>, 
      bg: "bg-blue-100" 
    },
    { 
      label: "Success Rate", 
      val: "100%", 
      icon: <TrendingUp className="text-purple-600 w-5 h-5"/>, 
      bg: "bg-purple-100" 
    },
    { 
      label: "Rating", 
      val: liveStats.rating || "5.0", 
      icon: <Star className="text-yellow-600 fill-yellow-600 w-5 h-5"/>, 
      bg: "bg-yellow-100" 
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Welcome back, {user?.full_name?.split(' ')[0] || "Freelancer"}! 👋
            </h1>
            <p className="text-slate-500 font-medium mt-1">Check your latest updates and project progress.</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button variant="outline" size="icon" className="shrink-0 rounded-xl border-slate-200">
              <Bell className="h-5 w-5 text-slate-600" />
            </Button>
            
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-100 font-bold px-6 rounded-xl"
              onClick={() => navigate("/search")} 
            >
              <Search className="mr-2 h-4 w-4 stroke-[3px]"/> Find Work
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((s, i) => (
            <Card key={i} className="border-none shadow-sm ring-1 ring-slate-200/60 rounded-2xl bg-white">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{s.label}</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">{s.val}</p>
                </div>
                <div className={`w-12 h-12 ${s.bg} rounded-2xl flex items-center justify-center`}>
                  {s.icon}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <RecommendedJobsSection />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="bg-slate-200/50 border-none p-1.5 rounded-2xl mb-6 inline-flex">
                <TabsTrigger value="active" className="rounded-xl px-6 font-bold data-[state=active]:bg-white">Active Projects</TabsTrigger>
                <TabsTrigger value="proposals" className="rounded-xl px-6 font-bold data-[state=active]:bg-white">My Proposals</TabsTrigger>
              </TabsList>
              
              <TabsContent value="active" className="space-y-4 outline-none">
                {loading ? (
                  <div className="flex justify-center py-12"><Loader2 className="animate-spin text-emerald-600" /></div>
                ) : activeContracts.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                    <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 font-bold">No active contracts yet.</p>
                  </div>
                ) : (
                  activeContracts.map((contract) => (
                    <Card key={contract.id} className="border-none shadow-sm ring-1 ring-slate-200/60 rounded-2xl bg-white">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                            <div>
                                <Badge className="mb-2 bg-emerald-50 text-emerald-700 border-none text-[9px] font-black uppercase tracking-widest">
                                  {contract.status === 'active' ? 'In Progress' : 'Review Required'}
                                </Badge>
                                <h3 className="font-black text-slate-900 text-xl">{contract.job_title}</h3>
                                <p className="text-sm text-slate-500 font-bold mt-0.5">Client: {contract.counterparty_name}</p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <p className="text-lg font-black text-slate-900">₦{Number(contract.amount).toLocaleString()}</p>
                              <Button 
                                onClick={() => navigate(`/workspace/${contract.id}`)}
                                variant="outline"
                                className="border-emerald-600 text-emerald-600 font-black text-xs h-9 px-4 rounded-xl flex gap-2"
                              >
                                Open Workspace <ExternalLink className="w-3 h-3" />
                              </Button>
                            </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="proposals" className="outline-none mt-6">
                <div className="text-center py-12 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                  <p className="text-slate-500 font-bold">Click to view all active bid submissions.</p>
                  <Button variant="link" onClick={() => navigate("/proposals")} className="text-emerald-600 font-black">View Proposals Page</Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm ring-1 ring-slate-200/60 rounded-2xl bg-white">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <CardTitle className="text-lg font-black text-slate-800">Wallet Overview</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-500">Available Balance</span>
                    <span className="font-black text-emerald-600 text-lg">₦{Number(user?.balance || 0).toLocaleString()}</span>
                  </div>
                  <Button 
                    className="w-full bg-slate-900 text-white font-black py-6 rounded-xl"
                    onClick={() => navigate("/wallet")}
                  >
                    Withdraw Funds
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none bg-emerald-600 text-white rounded-2xl shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <TrendingUp className="w-5 h-5 text-white" />
                  <h4 className="font-bold text-sm">Escrow Protection Active</h4>
                </div>
                <p className="text-emerald-50 text-[11px] leading-relaxed mb-4 font-medium">
                  Your payments are secured via the NaijaTrust Escrow system. Funds are held until work is approved.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}