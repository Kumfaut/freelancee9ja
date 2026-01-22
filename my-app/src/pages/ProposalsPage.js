"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/Tabs";
import { FileText, Clock, CheckCircle2, Loader2, Globe, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export default function ProposalsPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/proposals/my-proposals", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProposals(res.data); 
      } catch (err) {
        console.error("Error fetching proposals:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProposals();
  }, []);

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted": return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
      case "pending": return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
      case "rejected": return "bg-red-50 text-red-700 ring-1 ring-red-200";
      default: return "bg-slate-50 text-slate-600 ring-1 ring-slate-200";
    }
  };

  const translateStatus = (status) => {
    const s = status?.toLowerCase();
    if (s === 'pending') return t('status_pending');
    if (s === 'accepted') return t('status_accepted');
    if (s === 'rejected') return t('status_rejected');
    return status;
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="animate-spin text-emerald-600 h-10 w-10 mb-4" />
      <p className="text-slate-400 font-black text-xs uppercase tracking-widest">{t('searching_market')}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10">
      <div className="max-w-5xl mx-auto px-4">
        
        {/* Header & Language Toggle */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">{t('proposals_title')}</h1>
            <p className="text-slate-500 font-medium mt-1">{t('proposals_subtitle')}</p>
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
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="bg-slate-200/50 p-1.5 mb-8 rounded-2xl inline-flex">
            <TabsTrigger value="active" className="px-8 py-2.5 rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
              {t('tab_active_apps')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4 outline-none">
            {proposals.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-10 h-10 text-slate-200" />
                </div>
                <p className="text-slate-500 font-bold mb-6">{t('no_proposals')}</p>
                <Button 
                  onClick={() => navigate('/search')} 
                  className="bg-slate-900 hover:bg-emerald-600 text-white font-black px-10 h-12 rounded-xl transition-all"
                >
                  {t('browse_jobs')}
                </Button>
              </div>
            ) : (
              proposals.map((prop) => (
                <Card key={prop.id} className="border-none shadow-sm hover:shadow-xl transition-all rounded-[1.5rem] overflow-hidden bg-white ring-1 ring-slate-100 group">
                  <CardContent className="p-0">
                    <div className="flex">
                      <div className={`w-1.5 transition-all group-hover:w-3 ${prop.status === 'accepted' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                      <div className="p-8 flex-1 flex flex-col md:flex-row justify-between gap-8 items-start md:items-center">
                        
                        <div className="space-y-4 flex-1">
                          <div className="flex items-center justify-between md:justify-start gap-4">
                            <Badge className={`${getStatusStyle(prop.status)} px-3 py-1 rounded-lg border-none font-black uppercase text-[10px] tracking-widest`}>
                              {translateStatus(prop.status)}
                            </Badge>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                ID: #{prop.id.toString().slice(-5)}
                            </span>
                          </div>

                          <div>
                            <h3 className="text-2xl font-black text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors tracking-tight">
                                {prop.job_title}
                            </h3>
                            <p className="text-sm text-slate-500 font-bold">
                              {t('client_label')}: <span className="text-slate-900">{prop.client_name || "Private Client"}</span>
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-6 text-sm">
                            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg">
                              <Clock className="w-4 h-4 text-emerald-500" />
                              <span className="font-black text-slate-900">₦{Number(prop.bid_amount).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              <span className="font-bold text-slate-600">{prop.delivery_days || prop.timeline} {t('days')} {t('delivery_time')}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto md:border-l md:pl-8 border-slate-100">
                          <Button 
                            variant="outline" 
                            className="flex-1 md:flex-none rounded-xl border-slate-200 font-black text-xs uppercase tracking-widest h-12 px-6"
                            onClick={() => navigate(`/job/${prop.job_id}`)}
                          >
                            {t('view_job')}
                          </Button>
                          
                          {prop.status?.toLowerCase() === "accepted" && (
                            <Button 
                              className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-widest h-12 px-6 rounded-xl shadow-lg shadow-emerald-100"
                              onClick={() => {
                                if (prop.contract_id) {
                                  navigate(`/workspace/${prop.contract_id}`);
                                } else {
                                  toast.error(t('preparing_workspace'));
                                }
                              }}
                            >
                              {t('open_workspace')} <ExternalLink className="ml-2 w-3 h-3" />
                            </Button>
                          )}
                        </div>

                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}