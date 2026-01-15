"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { 
  Plus, Briefcase,  
  ChevronRight, MessageSquare, Loader2, Search 
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { fetchMyJobs } from "../api/api";
import { toast } from "sonner";

export default function ClientDashboard() {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getJobs = async () => {
      try {
        setLoading(true);
        const response = await fetchMyJobs();
        setJobs(response.data);
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Failed to load your jobs");
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn && user?.role === "client") {
      getJobs();
    }
  }, [isLoggedIn, user]);

  // Derived Stats based on real data
  const stats = useMemo(() => [
    { 
      label: "Active Projects", 
      val: jobs.filter(j => j.status === 'filled').length, 
      icon: <Briefcase className="text-blue-600 w-5 h-5"/>, 
      bg: "bg-blue-100" 
    },
    { 
      label: "Open Jobs", 
      val: jobs.filter(j => j.status !== 'filled').length, 
      icon: <Search className="text-emerald-600 w-5 h-5"/>, 
      bg: "bg-emerald-100" 
    },
    { 
      label: "Total Posted", 
      val: jobs.length, 
      icon: <Plus className="text-purple-600 w-5 h-5"/>, 
      bg: "bg-purple-100" 
    },
    { 
      label: "Messages", 
      val: "0", 
      icon: <MessageSquare className="text-orange-600 w-5 h-5"/>, 
      bg: "bg-orange-100" 
    },
  ], [jobs]);

  if (!isLoggedIn) return <Navigate to="/login" />;
  if (user.role !== "client") return <Navigate to="/freelancer-dashboard" />;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Welcome, {user?.full_name?.split(' ')[0] || "Client"} 👋
            </h1>
            <p className="text-slate-500 font-medium">You have {jobs.length} jobs currently active.</p>
          </div>
          <Button 
            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-100 font-bold h-11 px-6 rounded-xl"
            onClick={() => navigate("/post-job")}
          >
            <Plus className="mr-2 h-5 w-5" /> Post a New Job
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((s, i) => (
            <Card key={i} className="border-none shadow-sm ring-1 ring-slate-200/60">
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

        {/* Jobs Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900">Your Posted Jobs</h2>
            <Button variant="ghost" className="text-emerald-600 font-black text-xs uppercase tracking-wider">
              See All
            </Button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100">
              <Loader2 className="animate-spin text-emerald-600 h-10 w-10 mb-4" />
              <p className="text-slate-400 font-bold">Fetching your projects...</p>
            </div>
          ) : jobs.length === 0 ? (
            <Card className="p-16 text-center border-dashed border-2 border-slate-200 bg-white/50 rounded-3xl">
              <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="text-slate-400 w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No jobs posted yet</h3>
              <p className="text-slate-500 mb-6 max-w-xs mx-auto">Start by posting a job to find the best Nigerian talent for your project.</p>
              <Button onClick={() => navigate("/post-job")} className="bg-emerald-600 font-bold">
                Post Your First Job
              </Button>
            </Card>
          ) : (
            <div className="grid gap-4">
              {jobs.map((job) => (
                <Card 
                  key={job.id} 
                  className="border-none shadow-sm hover:shadow-md transition-all bg-white rounded-2xl ring-1 ring-slate-200/50"
                >
                  <CardContent className="p-5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex gap-5 items-center flex-1">
                      <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center font-black text-slate-400 text-xs border border-slate-100">
                        #{job.id}
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 text-lg leading-tight">
                          {job.title}
                        </h4>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                            ₦{Number(job.budget_min).toLocaleString()}
                          </span>
                          <span className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">
                            {job.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0">
                      <Badge className={`border-none px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full ${
                        job.status === 'filled' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {job.status === 'filled' ? 'Ongoing' : 'Hiring'}
                      </Badge>

                      {job.status === 'filled' ? (
                        <Button 
                          onClick={() => navigate(`/workspace/${job.contract_id}`)}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black h-10 px-5 rounded-xl flex gap-2 shadow-lg shadow-blue-100"
                        >
                          <Briefcase className="w-4 h-4" /> Manage Project
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => navigate(`/manage-project/${job.id}`)}
                          variant="outline"
                          className="border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-black h-10 px-5 rounded-xl flex gap-2"
                        >
                          View Proposals <ChevronRight className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}