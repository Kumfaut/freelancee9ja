"use client";

import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fetchSavedJobs, toggleSaveJob } from "../api/api";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { toast } from "sonner";
import { 
  Trash2, MapPin, Clock, Briefcase, 
  ChevronRight, Bookmark, Loader2 
} from "lucide-react";

export default function SavedJobsPage() {
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const response = await fetchSavedJobs();
      
      // Handle array vs nested data object
      const jobsArray = Array.isArray(response.data) 
        ? response.data 
        : response.data?.data || [];
      
      console.log("Jobs to be set in state:", jobsArray);
      setSavedJobs(jobsArray);
    } catch (error) {
      console.error("Error loading saved jobs:", error);
      toast.error("Failed to load saved jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleRemove = async (jobId) => {
    try {
      await toggleSaveJob(jobId); 
      // Filter by checking both id and job_id to ensure removal works
      setSavedJobs(prev => prev.filter(job => (job.id || job.job_id) !== jobId));
      toast.success("Job removed from saved list");
    } catch (error) {
      toast.error("Failed to remove job");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
      </div>
    );
  }

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
              <Button className="mt-6 bg-emerald-600 text-white font-bold" onClick={() => navigate("/search")}>
                Start Searching
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {savedJobs.map((job) => {
              // FIX: Catch both 'id' and 'job_id' and 'title' and 'job_title'
              const displayId = job.job_id || job.id;
              const displayTitle = job.title || job.job_title || "Untitled Job";

              return (
                <Card key={displayId} className="group border-none shadow-sm hover:shadow-md transition-all bg-white">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row items-stretch md:items-center p-6 gap-6">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-emerald-50 text-emerald-700 border-none px-2 py-0 text-[10px] font-bold uppercase">
                            {job.category || "General"}
                          </Badge>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                            <Clock className="w-3 h-3" /> 
                            {job.created_at ? new Date(job.created_at).toLocaleDateString() : 'Recent'}
                          </span>
                        </div>
                        
                        <Link to={`/job/${displayId}`} className="block">
                          <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                            {displayTitle}
                          </h3>
                        </Link>

                        <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1.5 font-medium italic text-emerald-600">
                            ₦{Number(job.budget_max || job.budget || 0).toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1.5 tracking-tight">
                            <MapPin className="w-4 h-4 text-slate-300" /> {job.location || 'Remote'}
                          </span>
                          <span className="flex items-center gap-1.5 tracking-tight">
                            <Briefcase className="w-4 h-4 text-slate-300" /> {job.experience_level || 'Any'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-slate-400 hover:text-red-500 hover:bg-red-50"
                          onClick={() => handleRemove(displayId)}
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                        <Button 
                          className="bg-emerald-600 hover:bg-emerald-700 flex-1 md:flex-none gap-2 text-white font-bold"
                          onClick={() => navigate(`/job/${displayId}`)}
                        >
                          Apply <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}