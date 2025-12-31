"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Hook at the top
import { Card, CardContent } from "./ui/Card";
import { Button } from "./ui/Button";
import { Progress } from "./ui/Progress";
import { Badge } from "./ui/Badge";
import { ShieldCheck, Lock, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

export default function MilestoneTracker({ totalBudget = 800000 }) {
  const navigate = useNavigate(); // Initialize navigate here

  const [milestones] = useState([
    { id: 1, title: "UI Design & Prototyping", amount: 200000, status: "completed" },
    { id: 2, title: "Frontend Development", amount: 400000, status: "funded" },
    { id: 3, title: "Backend & Paystack Integration", amount: 200000, status: "pending" },
  ]);

  const completedAmount = milestones
    .filter(m => m.status === "completed")
    .reduce((sum, m) => sum + m.amount, 0);

  const progressPercent = (completedAmount / totalBudget) * 100;

  return (
    <div className="space-y-6">
      {/* ESCROW STATUS HEADER */}
      <Card className="border-none shadow-md bg-emerald-900 text-white overflow-hidden">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-emerald-200 text-xs font-bold uppercase tracking-widest">NaijaTrust Escrow</p>
              <h2 className="text-3xl font-black">₦{totalBudget.toLocaleString()}</h2>
              <div className="flex items-center gap-2 text-sm text-emerald-100/80">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Secure & Verified</span>
              </div>
            </div>
            <div className="hidden sm:block">
              <Lock className="w-12 h-12 text-emerald-700/50" />
            </div>
          </div>
          
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span>Project Completion</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <Progress value={progressPercent} className="h-2 bg-white/10" />
          </div>
        </CardContent>
      </Card>

      {/* MILESTONE LIST */}
      <div className="space-y-3">
        <h3 className="font-bold text-slate-800 px-1">Payment Schedule</h3>
        {milestones.map((m, index) => (
          <Card key={m.id} className="border-none shadow-sm hover:shadow-md transition-all overflow-hidden">
            <CardContent className="p-0">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    m.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {m.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{m.title}</h4>
                    <p className="text-xs text-slate-500 font-medium">₦{m.amount.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {m.status === "completed" && (
                    <Badge className="bg-emerald-100 text-emerald-700 border-none px-3 py-1">Released</Badge>
                  )}
                  {m.status === "funded" && (
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-100 text-blue-700 border-none px-3 py-1 flex gap-1 items-center">
                        <Lock className="w-3 h-3" /> Funded
                      </Badge>
                      <Button size="sm" className="bg-emerald-600 h-8 text-xs font-bold">Submit Work</Button>
                    </div>
                  )}
                  {m.status === "pending" && (
                    <Badge variant="outline" className="text-slate-400 border-slate-200">Waiting</Badge>
                  )}
                </div>
              </div>

              {/* SUCCESS BANNER FOR COMPLETED MILESTONES */}
              {m.status === "completed" && (
                <div className="bg-emerald-50 px-4 py-2 border-t border-emerald-100 flex justify-between items-center group cursor-pointer hover:bg-emerald-100/50 transition-colors" onClick={() => navigate("/wallet")}>
                  <p className="text-[10px] text-emerald-700 font-bold uppercase tracking-tight flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Funds released to wallet
                  </p>
                  <span className="text-[10px] font-black text-emerald-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    VIEW WALLET <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* SECURITY NOTICE */}
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3 items-start">
        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800 leading-relaxed">
          <strong>Note:</strong> Once a milestone is <strong>Funded</strong>, the money is safely held in escrow. The freelancer can see that the funds are secured, and the client releases them only after work is approved.
        </p>
      </div>
    </div>
  );
}