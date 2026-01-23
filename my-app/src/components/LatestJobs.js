"use client";

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { Clock, MapPin, Briefcase, ArrowRight, AlertCircle } from "lucide-react";

export default function LatestJobs() {
  const { t } = useTranslation();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorState, setErrorState] = useState(null); // Changed name to satisfy linter

  useEffect(() => {
    const fetchLatestJobs = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/jobs/latest");
        const data = Array.isArray(response.data) ? response.data : response.data.data;
        setJobs(data || []);
        setErrorState(null); // Clear error on success
      } catch (err) {
        console.error("Fetch error:", err);
        setErrorState(t('jobs_error'));
      } finally {
        setLoading(false);
      }
    };

    fetchLatestJobs();
  }, [t]);

  // Loading UI
  if (loading) {
    return (
      <section className="px-4 py-20 bg-slate-50/50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-pulse flex flex-col items-center space-y-4">
            <div className="h-4 w-32 bg-slate-200 rounded-full"></div>
            <div className="h-10 w-64 bg-slate-200 rounded-xl"></div>
            <div className="grid gap-4 w-full mt-8">
              {[1, 2].map(i => <div key={i} className="h-48 bg-white rounded-4xl border border-slate-100 shadow-sm" />)}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error UI - This now uses the 'errorState' variable, fixing the ESLint error
  if (errorState) {
    return (
      <section className="px-4 py-20 bg-slate-50/50">
        <div className="max-w-xl mx-auto text-center p-12 bg-white rounded-[2.5rem] border border-red-50 shadow-xl shadow-red-900/5">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="text-red-500" size={32} />
          </div>
          <p className="text-slate-900 font-black uppercase text-[10px] tracking-widest mb-4">
            {errorState}
          </p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline" 
            className="rounded-xl border-slate-200 font-bold text-xs"
          >
            Try Refreshing
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-20 bg-slate-50/50">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-4 text-center md:text-left">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">{t('jobs_title')}</h2>
            <p className="text-slate-500 mt-2 font-medium">{t('jobs_subtitle')}</p>
          </div>
          <Link to="/search" className="hidden md:block">
            <Button variant="ghost" className="text-emerald-600 font-black text-[10px] uppercase tracking-widest hover:bg-emerald-50 rounded-full px-6">
              {t('jobs_browse_all')} <ArrowRight size={14} className="ml-2" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 max-w-2xl mx-auto">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <Link to={`/jobs/${job.id}`} key={job.id} className="block group">
                <Card className="border-none shadow-sm group-hover:shadow-xl group-hover:shadow-emerald-900/5 group-hover:-translate-y-1 transition-all duration-300 rounded-[2.5rem] overflow-hidden bg-white p-2">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start gap-4">
                      <CardTitle className="text-xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors tracking-tight uppercase">
                        {job.title}
                      </CardTitle>
                      <div className="text-emerald-600 font-black text-xl tracking-tighter">
                        ₦{Number(job.budget_max || job.budget).toLocaleString()}
                      </div>
                    </div>
                    <CardDescription className="line-clamp-2 text-slate-500 font-medium mt-3 leading-relaxed">
                      {job.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="mt-4">
                    <div className="flex flex-wrap gap-2 mb-6">
                      {(Array.isArray(job.skills) ? job.skills : job.skills?.split(",") || [])
                        .slice(0, 3)
                        .map((skill, i) => (
                          <Badge key={i} className="bg-slate-50 text-slate-500 border-none font-black text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-lg">
                            {skill.trim()}
                          </Badge>
                      ))}
                      {(job.skills?.split(",").length || 0) > 3 && (
                        <span className="text-[9px] text-slate-300 font-black uppercase tracking-widest self-center ml-1">
                          +{(job.skills?.split(",").length || 0) - 3} {t('jobs_more_skills')}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.15em]">
                      <div className="flex gap-4 text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <MapPin size={14} className="text-emerald-500" /> {job.location || t('jobs_remote')}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock size={14} className="text-emerald-500" /> {new Date(job.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <span className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full border border-emerald-100/50">
                        {job.proposal_count || 0} {t('jobs_proposals')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase className="text-slate-200" size={40} />
              </div>
              <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">{t('jobs_no_jobs')}</p>
            </div>
          )}
        </div>

        <div className="text-center mt-12 md:hidden">
          <Link to="/search">
            <Button className="w-full bg-slate-900 text-white font-black h-14 rounded-2xl uppercase text-[10px] tracking-widest shadow-lg shadow-slate-200">
              {t('jobs_browse_all')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}