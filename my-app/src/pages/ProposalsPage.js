"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/Tabs";
import { FileText, Clock, CheckCircle2, Loader2} from "lucide-react";
import { toast } from "sonner"; // or "react-hot-toast" depending on your setup

export default function ProposalsPage() {
  const navigate = useNavigate();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const token = localStorage.getItem("token");
        // Update this URL to match your backend route
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
      case "accepted": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "pending": return "bg-amber-100 text-amber-700 border-amber-200";
      case "rejected": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-slate-100 text-slate-600";
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-emerald-600 h-10 w-10" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900">My Proposals</h1>
          <p className="text-slate-500 font-medium">Track your applications and their current status.</p>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="bg-slate-200/50 p-1 mb-8 rounded-xl inline-flex">
            <TabsTrigger value="active" className="px-8 py-2 rounded-lg font-bold">Active Applications</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {proposals.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-[2rem] border-2 border-dashed border-slate-100">
                <FileText className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 font-bold">You haven't submitted any proposals yet.</p>
                <Button onClick={() => navigate('/search')} className="mt-4 bg-emerald-600">Browse Jobs</Button>
              </div>
            ) : (
              proposals.map((prop) => (
                <Card key={prop.id} className="border-none shadow-sm hover:shadow-md transition-all rounded-2xl overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-black text-slate-900 mb-1">{prop.job_title}</h3>
                            <p className="text-sm text-slate-500 font-medium">
                              Client: <span className="text-emerald-600">{prop.client_name || "Private Client"}</span>
                            </p>
                          </div>
                          <Badge className={`${getStatusStyle(prop.status)} px-3 py-1 rounded-lg border-none font-bold uppercase text-[10px]`}>
                            {prop.status}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-6 text-sm font-bold">
                          <div className="flex items-center gap-2 text-slate-500">
                            <Clock className="w-4 h-4 text-emerald-500" />
                            <span className="text-slate-900">₦{Number(prop.bid_amount).toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-500">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span>{prop.delivery_days || prop.timeline} Days Delivery</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 md:border-l md:pl-6 border-slate-100">
                        <Button 
                          variant="outline" 
                          className="rounded-xl border-slate-200 font-bold"
                          onClick={() => navigate(`/job/${prop.job_id}`)}
                        >
                          View Job
                        </Button>
                        {prop.status === "accepted" && (
                        <Button 
                          className="..."
                          onClick={() => {
                            if (prop.contract_id) {
                              navigate(`/workspace/${prop.contract_id}`);
                            } else {
                              toast.error("Workspace is being prepared. Please refresh in a moment.");
                            }
                          }}
                        >
                          Open Workspace
                        </Button>
                      )}
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