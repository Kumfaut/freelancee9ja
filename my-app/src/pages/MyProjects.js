"use client";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchUserContracts } from "../api/api";
import { Card, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { ChevronRight, Briefcase, Loader2, AlertCircle, Globe } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function MyProjects() {
  const { t, i18n } = useTranslation();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) return;

    let isMounted = true;
    const getContracts = async () => {
      try {
        setLoading(true);
        const res = await fetchUserContracts();
        if (isMounted) {
          setContracts(Array.isArray(res.data) ? res.data : []);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Project Load Error:", err);
          setError(t('load_error'));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    getContracts();
    return () => { isMounted = false; };
  }, [isLoggedIn, t]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-4" />
        <p className="text-slate-400 font-black text-xs uppercase tracking-widest">{t('loading_workspace')}</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto min-h-screen">
      {/* Header & Language Toggle */}
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="text-left">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">{t('projects_title')}</h1>
          <p className="text-slate-500 font-medium">{t('projects_subtitle')}</p>
        </div>

        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl shadow-sm ring-1 ring-slate-200">
          <Globe className="w-4 h-4 text-slate-400" />
          <select 
            className="text-[10px] font-black uppercase tracking-widest outline-none bg-transparent cursor-pointer"
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
      </header>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 font-bold animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {contracts.length === 0 ? (
        <Card className="border-2 border-dashed border-slate-200 bg-white/50 py-24 text-center rounded-[2.5rem]">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Briefcase className="w-10 h-10 text-slate-300" />
          </div>
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">{t('no_active_projects')}</h2>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto font-medium">
            {t('no_projects_desc')}
          </p>
          <Button 
            onClick={() => navigate("/")} 
            className="bg-slate-900 hover:bg-emerald-600 text-white font-black px-10 h-12 rounded-xl transition-all shadow-lg"
          >
            {t('explore_market')}
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {contracts.map((contract) => {
            const jobTitle = contract.job_title || "Untitled Project";
            const partner = contract.counterparty_name || "Project Partner";
            const budget = contract.amount || contract.agreed_budget || 0;

            return (
              <Card 
                key={contract.id} 
                className="border-none shadow-sm ring-1 ring-slate-200/60 hover:ring-emerald-500 hover:shadow-xl hover:-translate-y-1 transition-all rounded-[1.5rem] overflow-hidden bg-white group"
              >
                <CardContent className="p-0">
                  <div className="flex">
                    <div className={`w-2 transition-all group-hover:w-4 ${contract.status === 'active' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                    <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-8 flex-1">
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <Badge className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border-none ${
                            contract.status === 'active' 
                              ? 'bg-emerald-50 text-emerald-700' 
                              : 'bg-blue-50 text-blue-700'
                          }`}>
                            {contract.status || t('status_pending')}
                          </Badge>
                          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                            {t('project_id')}: #{contract.id.toString().slice(-6)}
                          </span>
                        </div>
                        
                        <h3 className="font-black text-2xl text-slate-900 group-hover:text-emerald-600 transition-colors tracking-tight mb-2">
                          {jobTitle}
                        </h3>
                        <p className="text-sm text-slate-500 font-bold">
                          {t('partner_label')}: <span className="text-slate-900">{partner}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end md:border-l md:pl-8 border-slate-100">
                        <div className="text-left md:text-right">
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{t('budget_label')}</p>
                          <p className="text-2xl font-black text-slate-900 tracking-tighter">
                            ₦{Number(budget).toLocaleString()}
                          </p>
                        </div>
                        
                        <Button 
                          onClick={() => navigate(`/workspace/${contract.id}`)}
                          className="bg-slate-900 hover:bg-emerald-600 text-white font-black px-8 h-14 rounded-2xl transition-all shadow-xl active:scale-95"
                        >
                          {t('open_workspace')} <ChevronRight className="ml-2 w-5 h-5" />
                        </Button>
                      </div>

                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}