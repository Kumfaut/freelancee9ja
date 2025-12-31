"use client";

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { 
  Trash2, 
  MapPin, 
  Clock, 
  Briefcase, 
  ChevronRight,
  Bookmark
} from "lucide-react";

export default function SavedJobsPage() {
  const navigate = useNavigate();

  // Mock data for saved jobs
  const [savedJobs, setSavedJobs] = useState([
    {
      id: "1",
      title: "React Developer for E-commerce Platform",
      budget: "₦500k - ₦800k",
      location: "Lagos (Remote)",
      type: "Fixed Price",
      posted: "2 days ago",
      category: "Web Development"
    },
    {
      id: "2",
      title: "UI/UX Designer for Fintech App",
      budget: "₦350k - ₦500k",
      location: "Abuja (Hybrid)",
      type: "Contract",
      posted: "5 hours ago",
      category: "Design"
    }
  ]);

  const removeJob = (id) => {
    setSavedJobs(savedJobs.filter(job => job.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Bookmark className="w-8 h-8 text-emerald-600 fill-emerald-600/10" />
              Saved Jobs
            </h1>
            <p className="text-slate-500 mt-1">
              You have {savedJobs.length} projects shortlisted.
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate("/search")}>
            Browse More Jobs
          </Button>
        </div>

        {/* Empty State */}
        {savedJobs.length === 0 ? (
          <Card className="border-dashed border-2 bg-white/50 py-20">
            <CardContent className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Bookmark className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">No saved jobs yet</h3>
              <p className="text-slate-500 max-w-xs mt-2">
                Click the heart icon on any job posting to save it for later.
              </p>
              <Button className="mt-6 bg-emerald-600" onClick={() => navigate("/search")}>
                Start Searching
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Jobs List */
          <div className="space-y-4">
            {savedJobs.map((job) => (
              <Card key={job.id} className="group border-none shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row items-stretch md:items-center p-6 gap-6">
                    
                    {/* Job Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-none px-2 py-0 text-[10px] font-bold uppercase">
                          {job.category}
                        </Badge>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3" /> {job.posted}
                        </span>
                      </div>
                      
                      <Link to={`/jobs/${job.id}`} className="block">
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                          {job.title}
                        </h3>
                      </Link>

                      <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1.5 font-medium italic text-emerald-600">
                          {job.budget}
                        </span>
                        <span className="flex items-center gap-1.5 tracking-tight">
                          <MapPin className="w-4 h-4 text-slate-300" /> {job.location}
                        </span>
                        <span className="flex items-center gap-1.5 tracking-tight">
                          <Briefcase className="w-4 h-4 text-slate-300" /> {job.type}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-slate-400 hover:text-red-500 hover:bg-red-50"
                        onClick={() => removeJob(job.id)}
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                      <Button 
                        className="bg-emerald-600 hover:bg-emerald-700 flex-1 md:flex-none gap-2"
                        onClick={() => navigate(`/jobs/${job.id}`)}
                      >
                        Apply <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>

                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}