"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { io } from "socket.io-client";
import { fetchProposalsByJob, fetchJobById, hireFreelancer } from "../api/api"; 
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { 
  ChevronLeft, Mail, Clock, 
  DollarSign, User, Loader2, CheckCircle2,
  TrendingUp, Globe
} from "lucide-react";
import { toast } from "sonner";

const socket = io("http://localhost:5000", { transports: ["websocket"] });

export default function ManageProposals() {
  const { t, i18n } = useTranslation();
  const { jobId } = useParams();
  const navigate = useNavigate();
  
  const [proposals, setProposals] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hiringId, setHiringId] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [jobRes, propRes] = await Promise.all([
        fetchJobById(jobId),
        fetchProposalsByJob(jobId)
      ]);
      setJob(jobRes.data);
      const proposalsArray = Array.isArray(propRes.data) 
        ? propRes.data 
        : propRes.data.proposals || [];
      setProposals(proposalsArray);
    } catch (err) {
      toast.error(t('load_error'));
    } finally {
      setLoading(false);
    }
  }, [jobId, t]);

  useEffect(() => {
    loadData();
    socket.emit("join_job_management", jobId);
    socket.on("new_proposal_received", (newProposal) => {
      setProposals((prev) => {
        if (prev.find(p => p.id === newProposal.id)) return prev;
        toast.info(`${t('new_proposal_from')} ${newProposal.full_name}!`);
        return [newProposal, ...prev];
      });
    });
    return () => {
      socket.off("new_proposal_received");
      socket.emit("leave_job_management", jobId);
    };
  }, [jobId, loadData, t]);

  const handleHire = async (proposal) => {
    const confirmed = window.confirm(
      t('hire_confirm', { name: proposal.full_name, amount: Number(proposal.bid_amount).toLocaleString() })
    );
    if (!confirmed) return;

    try {
      setHiringId(proposal.id);
      await hireFreelancer({
        job_id: proposal.job_id,
        freelancer_id: proposal.freelancer_id,
        proposal_id: proposal.id,
        amount: proposal.bid_amount
      }); 
      toast.success(t('hire_success'));
      navigate("/client-dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || t('hire_error'));
    } finally {
      setHiringId(null);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mb-4" />
      <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">{t('syncing_applicants')}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24">
      {/* STICKY NAV */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-50 py-4">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-emerald-600 transition-colors">
            <ChevronLeft className="w-4 h-4" /> {t('manage_back')}
          </button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-xl ring-1 ring-slate-200">
                <Globe className="w-3 h-3 text-slate-400" />
                <select 
                    className="text-[9px] font-black uppercase outline-none bg-transparent"
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
            <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full ring-1 ring-emerald-100">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-700">{t('live_management')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="space-y-4">
            <Badge className="bg-slate-900 text-white border-none px-4 py-1.5 rounded-lg font-black text-[10px] uppercase tracking-[0.2em]">Project #{jobId}</Badge>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-tight">
              {t('applicants_for')} <br/><span className="text-emerald-500">{job?.title}</span>
            </h1>
          </div>
          <div className="bg-white p-6 rounded-[2rem] shadow-sm ring-1 ring-slate-100 flex items-center gap-6">
            <div className="bg-emerald-500 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-100">
              <TrendingUp className="text-white w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('total_bids')}</p>
              <p className="text-3xl font-black text-slate-900 tracking-tighter">{proposals.length}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-8">
          {proposals.length === 0 ? (
            <div className="bg-white rounded-[3rem] p-24 text-center ring-1 ring-slate-100 shadow-sm">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <User className="text-slate-200 w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-3">{t('no_apps_title')}</h2>
              <p className="text-slate-400 font-medium max-w-sm mx-auto">{t('no_apps_desc')}</p>
            </div>
          ) : (
            proposals.map((prop) => (
              <Card key={prop.id} className="border-none shadow-sm hover:shadow-xl transition-all duration-500 rounded-[2.5rem] overflow-hidden bg-white ring-1 ring-slate-100 group">
                <CardContent className="p-0">
                  <div className="flex flex-col lg:flex-row">
                    <div className="p-10 flex-1">
                      <div className="flex items-start gap-6 mb-8">
                        <div className="w-20 h-20 bg-slate-900 rounded-[1.8rem] flex items-center justify-center text-white font-black text-3xl shadow-2xl group-hover:bg-emerald-600 transition-colors duration-500">
                          {prop.full_name?.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{prop.full_name}</h3>
                          <div className="flex items-center gap-2 mt-1.5">
                             <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{prop.freelancer_title || t('freelancer_label')}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-8 rounded-[2rem] ring-1 ring-slate-100 mb-8 group-hover:bg-emerald-50/20 transition-colors duration-500">
                        <p className="text-slate-600 font-medium leading-[1.8] italic text-lg">
                          "{prop.cover_letter}"
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl ring-1 ring-slate-100 shadow-sm">
                          <DollarSign className="w-5 h-5 text-emerald-500" />
                          <span className="text-lg font-black text-slate-900">₦{Number(prop.bid_amount).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl ring-1 ring-slate-100 shadow-sm">
                          <Clock className="w-5 h-5 text-emerald-500" />
                          <span className="text-lg font-black text-slate-900">{prop.delivery_days || prop.timeline} {t('days_to_deliver')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50/50 lg:w-72 p-10 flex flex-col justify-center gap-4 border-t lg:border-t-0 lg:border-l border-slate-100">
                      <Button 
                        disabled={hiringId !== null}
                        onClick={() => handleHire(prop)}
                        className="w-full bg-slate-900 hover:bg-emerald-600 h-16 rounded-2xl text-white font-black uppercase text-[10px] tracking-widest shadow-xl transition-all active:scale-95"
                      >
                        {hiringId === prop.id ? <Loader2 className="animate-spin" /> : t('hire_button')}
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => navigate(`/messages?user=${prop.freelancer_id}`)}
                        className="w-full h-16 rounded-2xl border-slate-200 bg-white font-black text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all uppercase text-[10px] tracking-widest"
                      >
                        <Mail className="w-4 h-4 mr-2" /> {t('message_button')}
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