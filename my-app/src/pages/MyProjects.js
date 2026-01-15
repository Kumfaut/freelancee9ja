"use client";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserContracts } from "../api/api";
import { Card, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { ChevronRight, Briefcase, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function MyProjects() {
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
          // Ensure we are setting an array even if the response is weird
          setContracts(Array.isArray(res.data) ? res.data : []);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Project Load Error:", err);
          setError("Could not load projects. Please check your connection.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    getContracts();
    return () => { isMounted = false; };
  }, [isLoggedIn]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-4" />
        <p className="text-slate-500 font-bold">Loading your workspace...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto min-h-screen">
      <header className="mb-10 text-center md:text-left">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Active Projects</h1>
        <p className="text-slate-500 font-medium">Manage your ongoing contracts and milestones.</p>
      </header>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 font-bold">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {contracts.length === 0 ? (
        <Card className="border-2 border-dashed border-slate-200 bg-transparent py-20 text-center rounded-3xl">
          <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800">No active projects yet</h2>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto">
            You don't have any ongoing contracts at the moment.
          </p>
          <Button onClick={() => navigate("/")} className="bg-emerald-600 font-bold px-8 text-white">
            Explore Marketplace
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {contracts.map((contract) => {
            // FIX: Use fallbacks for every field to prevent UI crashes
            const jobTitle = contract.job_title || "Untitled Project";
            const partner = contract.counterparty_name || "Project Partner";
            const budget = contract.amount || contract.agreed_budget || 0;

            return (
              <Card 
                key={contract.id} 
                className="border-none shadow-sm ring-1 ring-slate-200/60 hover:shadow-lg transition-all rounded-2xl overflow-hidden bg-white group"
              >
                <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border-none ${
                        contract.status === 'active' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {contract.status || 'Pending'}
                      </Badge>
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">
                        ID: #{contract.id}
                      </span>
                    </div>
                    
                    <h3 className="font-black text-xl text-slate-900 group-hover:text-emerald-600 transition-colors">
                      {jobTitle}
                    </h3>
                    <p className="text-sm text-slate-500 font-bold">
                      Partner: <span className="text-slate-800">{partner}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0">
                    <div className="text-right">
                      <p className="text-xs text-slate-400 font-black uppercase tracking-widest">Budget</p>
                      <p className="text-xl font-black text-slate-900">
                        ₦{Number(budget).toLocaleString()}
                      </p>
                    </div>
                    
                    <Button 
                      onClick={() => navigate(`/workspace/${contract.id}`)}
                      className="bg-slate-900 hover:bg-emerald-600 text-white font-black px-6 rounded-xl h-12 transition-all"
                    >
                      Open Workspace <ChevronRight className="ml-2 w-4 h-4" />
                    </Button>
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