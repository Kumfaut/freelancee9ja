"use client";

import React from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Plus, Users, Briefcase, CreditCard, ChevronRight, MessageSquare } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function ClientDashboard() {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  if (!isLoggedIn) return <Navigate to="/login" />;
  if (user.role !== "client") return <Navigate to="/freelancer-dashboard" />;

  const stats = [
    { label: "Active Projects", val: "2", icon: <Briefcase className="text-blue-600 w-5 h-5"/>, bg: "bg-blue-100" },
    { label: "Total Spent", val: "₦450k", icon: <CreditCard className="text-emerald-600 w-5 h-5"/>, bg: "bg-emerald-100" },
    { label: "Hired Talent", val: "5", icon: <Users className="text-purple-600 w-5 h-5"/>, bg: "bg-purple-100" },
    { label: "Unread Messages", val: "3", icon: <MessageSquare className="text-orange-600 w-5 h-5"/>, bg: "bg-orange-100" },
  ];

  const activeJobs = [
    { id: "NF-9920", title: "Build a Fintech Mobile App", status: "In Progress", freelancers: 2, spent: "₦1.2M" },
    { id: "NF-8841", title: "Logo Design for Logistics Co", status: "Reviewing", freelancers: 0, spent: "₦50k" }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Welcome, {user?.name?.split(' ')[0] || "Client"} 👋
            </h1>
            <p className="text-slate-500 text-sm">Manage your projects and hired talent here.</p>
          </div>
          <Button 
            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md font-bold"
            onClick={() => navigate("/post-job")}
          >
            <Plus className="mr-2 h-4 w-4" /> Post a New Job
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <Card key={i} className="border-none shadow-sm">
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

        {/* Active Jobs List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Your Active Jobs</h2>
            <Button variant="ghost" className="text-emerald-600 text-sm font-bold">See All</Button>
          </div>

          {activeJobs.map((job) => (
            /* Updated Card with Dynamic Navigation */
            <Card 
              key={job.id} 
              onClick={() => navigate(`/manage-project/${job.id}`)} 
              className="border-none shadow-sm hover:shadow-md transition-all cursor-pointer group bg-white"
            >
              <CardContent className="p-5 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-500 text-xs">
                    {job.id.split('-')[1]}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                      {job.title}
                    </h4>
                    <div className="flex gap-3 mt-1">
                      <span className="text-xs text-slate-400 font-medium">Budget: {job.spent}</span>
                      <span className="text-xs text-slate-400 font-medium">•</span>
                      <span className="text-xs text-slate-400 font-medium">{job.freelancers} Hired</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                  <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-none px-3 py-1 text-[10px] font-bold">
                    {job.status}
                  </Badge>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-all translate-x-0 group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}