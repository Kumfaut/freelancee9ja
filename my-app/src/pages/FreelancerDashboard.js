"use client";

import React from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/Tabs";
import { Progress } from "../components/ui/Progress";
import { Bell, Briefcase, DollarSign, Star, TrendingUp, Search, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function FreelancerDashboard() {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // Guard Clauses
  if (!isLoggedIn) return <Navigate to="/login" />;
  if (user.role !== "freelancer") return <Navigate to="/client-dashboard" />;

  const stats = [
    { label: "Total Earnings", val: "₦2.4M", icon: <DollarSign className="text-emerald-600 w-5 h-5"/>, bg: "bg-emerald-100" },
    { label: "Active Jobs", val: "3", icon: <Briefcase className="text-blue-600 w-5 h-5"/>, bg: "bg-blue-100" },
    { label: "Success Rate", val: "98%", icon: <TrendingUp className="text-purple-600 w-5 h-5"/>, bg: "bg-purple-100" },
    { label: "Rating", val: "4.9", icon: <Star className="text-yellow-600 fill-yellow-600 w-5 h-5"/>, bg: "bg-yellow-100" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Welcome back, {user?.name?.split(' ')[0] || "Freelancer"}! 👋
            </h1>
            <p className="text-slate-500 text-sm">You have 2 new messages and 1 invitation to interview.</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button variant="outline" size="icon" className="shrink-0 rounded-full">
              <Bell className="h-4 w-4" />
            </Button>
            
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
              onClick={() => navigate("/search")} 
            >
              <Search className="mr-2 h-4 w-4"/> Find Work
            </Button>

            <Button 
              variant="outline" 
              className="border-slate-200 hover:bg-white shadow-sm"
              onClick={() => navigate("/profile")}
            >
              <User className="mr-2 h-4 w-4" /> Profile
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <Card key={i} className="border-none shadow-sm overflow-hidden">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{s.label}</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">{s.val}</p>
                </div>
                <div className={`w-12 h-12 ${s.bg} rounded-xl flex items-center justify-center`}>
                  {s.icon}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="bg-slate-200/50 border-none p-1 rounded-xl">
                <TabsTrigger value="active" className="rounded-lg data-[state=active]:bg-white">Active Projects</TabsTrigger>
                <TabsTrigger value="proposals" className="rounded-lg data-[state=active]:bg-white">My Proposals</TabsTrigger>
              </TabsList>
              
              <TabsContent value="active" className="mt-6">
                <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="font-bold text-slate-900 text-lg">E-commerce Website Dev</h3>
                            <p className="text-sm text-slate-500">Client: TechStart Lagos</p>
                        </div>
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-none px-3 py-1">
                          In Progress
                        </Badge>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between text-xs font-bold text-slate-600">
                            <span>Project Completion</span>
                            <span>75%</span>
                        </div>
                        <Progress value={75} className="h-2 bg-slate-100" />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="proposals" className="mt-6">
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                  <p className="text-slate-500 text-sm">No active proposals found.</p>
                  <Button variant="link" onClick={() => navigate("/search")} className="text-emerald-600">
                    Browse jobs to submit proposals
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold">Recent Earnings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { job: "Mobile App UI", date: "Nov 24, 2024", amount: "₦120,000" },
                  { job: "API Integration", date: "Nov 20, 2024", amount: "₦45,000" }
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                    <div>
                        <p className="text-sm font-semibold text-slate-900">{item.job}</p>
                        <p className="text-[10px] text-slate-400 font-medium uppercase">{item.date}</p>
                    </div>
                    <p className="font-bold text-emerald-600 text-sm">{item.amount}</p>
                  </div>
                ))}
                <Button 
                  variant="ghost" 
                  className="w-full text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 text-sm font-bold mt-2"
                  onClick={() => navigate("/wallet")}
                >
                  View All Transactions
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}