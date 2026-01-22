"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { 
  Plus, Briefcase, ChevronRight, MessageSquare, 
  Loader2, Search, Globe 
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { fetchMyJobs } from "../api/api";
import { toast } from "sonner";

export default function ClientDashboard() {
  const { t, i18n } = useTranslation();
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getJobs = async () => {
      try {
        setLoading(true);
        const response = await fetchMyJobs();
        setJobs(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        toast.error(t('load_error'));
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn && user?.role === "client") {
      getJobs();
    }
  }, [isLoggedIn, user, t]);

  const stats = useMemo(() => [
    { 
      label: t('stat_active_projects'), 
      val: jobs.filter(j => j.status === 'filled').length, 
      icon: <Briefcase className="text-blue-600 w-5 h-5"/>, 
      bg: "bg-blue-50" 
    },
    { 
      label: t('stat_open_jobs'), 
      val: jobs.filter(j => j.status !== 'filled').length, 
      icon: <Search className="text-emerald-600 w-5 h-5"/>, 
      bg: "bg-emerald-50" 
    },
    { 
      label: t('stat_total_posted'), 
      val: jobs.length, 
      icon: <Plus className="text-purple-600 w-5 h-5"/>, 
      bg: "bg-purple-50" 
    },
    { 
      label: t('stat_messages'), 
      val: "0", 
      icon: <MessageSquare className="text-orange-600 w-5 h-5"/>, 
      bg: "bg-orange-50" 
    },
  ], [jobs, t]);

  if (!isLoggedIn) return <Navigate to="/login" />;
  if (user.role !== "client") return <Navigate to="/freelancer-dashboard" />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <div className="container mx-auto px-4 py-10 max-w-6xl">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div className="text-left">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">
              {t('client_welcome')}, {user?.full_name?.split(' ')[0] || "Client"} 👋
            </h1>
            <p className="text-slate-500 font-bold mt-1">
              {t('active_jobs_count', { count: jobs.length })}
            </p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-1 bg-white px-3 py-2 rounded-xl shadow-sm ring-1 ring-slate-200">
                <Globe className="w-4 h-4 text-slate-400" />
                <select 
                    className="text-[10px] font-black uppercase outline-none bg-transparent cursor-pointer"
                    value={i18n.language}
                    onChange={(e) => i18n.changeLanguage(e.target.value)}
                >
                    <option value="en">EN</option>
                    <option value="pcm">PCM</option>
                    <option value="ig">IG</option>
                    <option value="yo">YO</option>
                    <option value="ha">HA</option>
                </select>
            </div>
            <Button 
                className="bg-slate-900 hover:bg-emerald-600 text-white shadow-xl font-black h-14 px-8 rounded-2xl transition-all flex-1 md:flex-none uppercase text-xs tracking-widest"
                onClick={() => navigate("/post-job")}
            >
                <Plus className="mr-2 h-5 w-5" /> {t('post_new_job')}
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {stats.map((s, i) => (
            <Card key={i} className="border-none shadow-sm ring-1 ring-slate-200/50 rounded-3xl overflow-hidden bg-white">
              <CardContent className="p-6 flex flex-col md:flex-row items-center md:justify-between gap-4 text-center md:text-left">
                <div className={`w-12 h-12 ${s.bg} rounded-2xl flex items-center justify-center shrink-0`}>
                  {s.icon}
                </div>
                <div className="md:text-right">
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">{s.label}</p>
                  <p className="text-2xl font-black text-slate-900 tracking-tighter">{s.val}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Jobs Management Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{t('your_posted_jobs')}</h2>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[3rem] ring-1 ring-slate-100">
              <Loader2 className="animate-spin text-emerald-600 h-12 w-12 mb-4" />
              <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">{t('fetching_projects')}</p>
            </div>
          ) : jobs.length === 0 ? (
            <Card className="p-20 text-center border-none ring-1 ring-slate-200 bg-white rounded-[3rem]">
              <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase className="text-slate-300 w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">{t('no_jobs_title')}</h3>
              <p className="text-slate-500 mb-8 max-w-xs mx-auto font-medium leading-relaxed">
                {t('no_jobs_desc')}
              </p>
              <Button onClick={() => navigate("/post-job")} className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-10 h-14 rounded-2xl shadow-lg transition-all uppercase text-xs tracking-widest">
                {t('post_first_job')}
              </Button>
            </Card>
          ) : (
            <div className="grid gap-5">
              {jobs.map((job) => (
                <Card 
                  key={job.id} 
                  className="border-none shadow-sm hover:shadow-xl transition-all bg-white rounded-[2rem] ring-1 ring-slate-200/60 overflow-hidden group"
                >
                  <CardContent className="p-0">
                    <div className="flex">
                      <div className={`w-2 ${job.status === 'filled' ? 'bg-blue-500' : 'bg-orange-500'}`} />
                      <div className="p-8 flex flex-col md:flex-row justify-between items-center gap-8 flex-1">
                        <div className="flex gap-6 items-center flex-1 w-full">
                          <div className="hidden sm:flex w-14 h-14 bg-slate-50 rounded-2xl items-center justify-center font-black text-slate-400 text-xs border border-slate-100 shadow-inner shrink-0">
                            #{job.id.toString().slice(-4)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-black text-slate-900 text-2xl leading-none tracking-tight group-hover:text-emerald-600 transition-colors truncate">
                              {job.title}
                            </h4>
                            <div className="flex flex-wrap items-center gap-4 mt-3">
                              <span className="text-[11px] font-black text-emerald-700 bg-emerald-50 ring-1 ring-emerald-100 px-3 py-1 rounded-lg uppercase tracking-widest">
                                ₦{Number(job.budget_min).toLocaleString()}
                              </span>
                              <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                                {job.category}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-6 md:pt-0">
                          <Badge className={`border-none px-5 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-inner ${
                            job.status === 'filled' 
                              ? 'bg-blue-50 text-blue-600' 
                              : 'bg-orange-50 text-orange-600'
                          }`}>
                            {job.status === 'filled' ? t('status_ongoing') : t('status_hiring')}
                          </Badge>

                          {job.status === 'filled' ? (
                            <Button 
                              onClick={() => navigate(`/workspace/${job.contract_id}`)}
                              className="bg-blue-600 hover:bg-slate-900 text-white text-[10px] font-black h-14 px-8 rounded-2xl flex gap-2 shadow-xl shadow-blue-100 uppercase tracking-widest transition-all"
                            >
                              <Briefcase className="w-4 h-4" /> {t('manage_project')}
                            </Button>
                          ) : (
                            <Button 
                              onClick={() => navigate(`/manage-project/${job.id}`)}
                              variant="outline"
                              className="bg-slate-900 text-white hover:bg-emerald-600 border-none text-[10px] font-black h-14 px-8 rounded-2xl flex gap-2 shadow-lg uppercase tracking-widest transition-all"
                            >
                              {t('view_proposals')} <ChevronRight className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
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