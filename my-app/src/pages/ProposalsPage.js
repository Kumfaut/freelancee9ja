"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/Tabs";
import { 
  FileText, 
  MessageCircle, 
  Clock, 
  CheckCircle2, 
  MoreVertical
} from "lucide-react";

export default function ProposalsPage() {
  const navigate = useNavigate();

  // Mock data for proposals
  const [proposals] = useState([
    {
      id: "p1",
      jobTitle: "React Developer for E-commerce Platform",
      client: "Adebayo Electronics",
      bid: "₦650,000",
      status: "interviewing", // interviewing, pending, declined
      submittedDate: "Oct 28, 2023",
      messages: 4
    },
    {
      id: "p2",
      jobTitle: "UI/UX Designer for Fintech App",
      client: "Kuda Clone Startup",
      bid: "₦400,000",
      status: "pending",
      submittedDate: "Oct 29, 2023",
      messages: 0
    }
  ]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "interviewing": return "bg-blue-100 text-blue-700 border-blue-200";
      case "pending": return "bg-amber-100 text-amber-700 border-amber-200";
      case "declined": return "bg-slate-100 text-slate-600 border-slate-200";
      default: return "bg-slate-100";
    }
  };

  return (
    
    <div className="min-h-screen bg-[#F8FAFC] py-10">
      <div className="max-w-5xl mx-auto px-4">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">My Proposals</h1>
          <p className="text-slate-500 mt-1">Track and manage your project applications.</p>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="bg-white border border-slate-200 p-1 mb-8">
            <TabsTrigger value="active" className="px-8 py-2">Active ({proposals.length})</TabsTrigger>
            <TabsTrigger value="archived" className="px-8 py-2">Archived (0)</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {proposals.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                <FileText className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-500">You haven't submitted any proposals yet.</p>
              </div>
            ) : (
              proposals.map((prop) => (
                <Card key={prop.id} className="border-none shadow-sm hover:shadow-md transition-all">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      
                      {/* Left Side: Info */}
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-1">{prop.jobTitle}</h3>
                            <p className="text-sm text-slate-500 flex items-center gap-1.5">
                              Client: <span className="font-semibold text-slate-700">{prop.client}</span>
                            </p>
                          </div>
                          <Badge className={`${getStatusStyle(prop.status)} px-3 py-1 capitalize border font-bold`}>
                            {prop.status}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-6 text-sm">
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <Clock className="w-4 h-4 text-emerald-500" />
                            Submitted: <span className="text-slate-900 font-medium">{prop.submittedDate}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            Bid Amount: <span className="text-slate-900 font-bold">{prop.bid}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Side: Actions */}
                      <div className="flex items-center gap-3 border-t md:border-t-0 pt-4 md:pt-0">
                        {prop.status === "interviewing" && (
                          <Button 
                            variant="outline" 
                            className="flex-1 md:flex-none border-blue-200 text-blue-600 hover:bg-blue-50 gap-2"
                            onClick={() => navigate("/messages")}
                          >
                            <MessageCircle className="w-4 h-4" />
                            {prop.messages} Messages
                          </Button>
                        )}
                        <Button 
                          className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => navigate(`/jobs/${prop.id}`)}
                        >
                          View Job Details
                        </Button>
                        <Button variant="ghost" size="icon" className="text-slate-400">
                          <MoreVertical className="w-5 h-5" />
                        </Button>
                        <Button 
                            className="bg-emerald-600"
                            onClick={() => navigate(`/workspace/${prop.id}`)}
                        >
                            Manage Project
                        </Button>
                      </div>

                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="archived">
            <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <p className="text-slate-400">No archived proposals.</p>
            </div>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}