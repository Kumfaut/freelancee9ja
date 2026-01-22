"use client";

import React, { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { 
  fetchRecommendedJobs, 
  fetchUserContracts 
} from "../api/api";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/Tabs";
import { Progress } from "../components/ui/Progress";
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
                {job.category.replace(/-/g, ' ')}
              </Badge>
              <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
                {job.title}
              </h3>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-black text-slate-900">
                  ₦{Number(job.budget_max).toLocaleString()}
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getContracts = async () => {
      try {
        const res = await fetchUserContracts();
        setActiveContracts(res.data || []);
      } catch (err) {
        console.error("Error fetching contracts:", err);
      } finally {
        setLoading(false);
      }
    };
    if (isLoggedIn) getContracts();
  }, [isLoggedIn]);

  if (!isLoggedIn) return <Navigate to="/login" />;
  if (user?.role !== "freelancer") return <Navigate to="/client-dashboard" />;

  const stats = [
    { label: "Total Earnings", val: "₦2.4M", icon: <DollarSign className="text-emerald-600 w-5 h-5"/>, bg: "bg-emerald-100" },
    { label: "Active Jobs", val: activeContracts.length, icon: <Briefcase className="text-blue-600 w-5 h-5"/>, bg: "bg-blue-100" },
    { label: "Success Rate", val: "98%", icon: <TrendingUp className="text-purple-600 w-5 h-5"/>, bg: "bg-purple-100" },
    { label: "Rating", val: "4.9", icon: <Star className="text-yellow-600 fill-yellow-600 w-5 h-5"/>, bg: "bg-yellow-100" },
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

        {/* --- RECOMMENDED SECTION (NEW) --- */}
        <RecommendedJobsSection />

        {/* Main Content Area */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="bg-slate-200/50 border-none p-1.5 rounded-2xl mb-6 inline-flex">
                <TabsTrigger value="active" className="rounded-xl px-6 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  Active Projects
                </TabsTrigger>
                <TabsTrigger value="proposals" className="rounded-xl px-6 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  My Proposals
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="active" className="space-y-4 outline-none">
                {loading ? (
                  <div className="flex justify-center py-12"><Loader2 className="animate-spin text-emerald-600" /></div>
                ) : activeContracts.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                    <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 font-bold">No active contracts yet.</p>
                    <Button variant="link" onClick={() => navigate("/search")} className="text-emerald-600 font-black">
                      Browse jobs and start earning
                    </Button>
                  </div>
                ) : (
                  activeContracts.map((contract) => (
                    <Card key={contract.id} className="border-none shadow-sm ring-1 ring-slate-200/60 hover:shadow-md transition-all rounded-2xl overflow-hidden group bg-white">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                            <div>
                                <Badge className="mb-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-none text-[9px] font-black uppercase tracking-widest">
                                  {contract.status === 'completed' ? 'Review Pending' : 'In Progress'}
                                </Badge>
                                <h3 className="font-black text-slate-900 text-xl group-hover:text-emerald-600 transition-colors">
                                  {contract.job_title}
                                </h3>
                                <p className="text-sm text-slate-500 font-bold mt-0.5">Client: {contract.counterparty_name}</p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <p className="text-lg font-black text-slate-900">₦{Number(contract.amount).toLocaleString()}</p>
                              <Button 
                                onClick={() => navigate(`/workspace/${contract.id}`)}
                                variant="outline"
                                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-black text-xs h-9 px-4 rounded-xl flex gap-2"
                              >
                                Open Workspace <ExternalLink className="w-3 h-3" />
                              </Button>
                            </div>
                        </div>
                        
                        <div className="space-y-3 pt-4 border-t border-slate-50">
                            <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <span>Current Status</span>
                                <span>{contract.status === 'completed' ? '100%' : '60%'}</span>
                            </div>
                            <Progress value={contract.status === 'completed' ? 100 : 60} className="h-2 bg-slate-100" />
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="proposals" className="outline-none mt-6">
                <div className="text-center py-12 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                  <p className="text-slate-500 font-bold">No active proposals found.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm ring-1 ring-slate-200/60 rounded-2xl overflow-hidden bg-white">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <CardTitle className="text-lg font-black text-slate-800">Recent Earnings</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-50">
                  {[
                    { job: "Mobile App UI", date: "Nov 24, 2024", amount: "₦120,000" },
                    { job: "API Integration", date: "Nov 20, 2024", amount: "₦45,000" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-4 hover:bg-slate-50 transition-colors">
                      <div>
                          <p className="text-sm font-bold text-slate-900">{item.job}</p>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">{item.date}</p>
                      </div>
                      <p className="font-black text-emerald-600 text-sm">{item.amount}</p>
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-slate-50/50">
                  <Button 
                    variant="ghost" 
                    className="w-full text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100/50 text-xs font-black uppercase tracking-widest"
                    onClick={() => navigate("/wallet")}
                  >
                    View All Transactions
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-bold text-sm">Upgrade to Pro</h4>
                </div>
                <p className="text-emerald-50 text-[11px] leading-relaxed mb-4 font-medium">
                  Get 20% lower service fees and featured placement on job searches.
                </p>
                <Button className="w-full bg-white text-emerald-600 font-black text-xs hover:bg-emerald-50 rounded-xl py-5 shadow-sm transition-all active:scale-95">
                  Learn More
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}