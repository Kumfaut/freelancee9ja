import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { Clock, MapPin, Briefcase } from "lucide-react";

export default function LatestJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLatestJobs = async () => {
      try {
        setLoading(true);
        // Ensure this URL matches your backend server port and route
        const response = await axios.get("http://localhost:5000/api/jobs/latest");
        
        // Handle both Array response or { data: [] } response
        const data = Array.isArray(response.data) ? response.data : response.data.data;
        setJobs(data || []);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Could not load latest jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchLatestJobs();
  }, []);

  if (loading) {
    return (
      <section className="px-4 py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-pulse flex flex-col items-center space-y-4">
            <div className="h-8 w-48 bg-gray-200 rounded"></div>
            <div className="h-40 w-full max-w-2xl bg-gray-200 rounded-2xl"></div>
            <div className="h-40 w-full max-w-2xl bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 text-red-500 font-medium">
        {error}
      </div>
    );
  }

  return (
    <section className="px-4 py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Latest Job Posts</h2>
            <p className="text-slate-500 mt-2">Discover the newest opportunities in the marketplace</p>
          </div>
          <Link to="/search" className="hidden md:block">
            <Button variant="ghost" className="text-emerald-600 font-bold hover:bg-emerald-50">
              Browse All →
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 max-w-2xl mx-auto">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              // Change this in LatestJobs.js
              // Inside LatestJobs.js
<Link to={`/jobs/${job.id}`} key={job.id} className="block group">
                <Card className="border-none shadow-sm hover:shadow-md hover:border-emerald-500 border-2 border-transparent transition-all duration-300 rounded-2xl overflow-hidden bg-white">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                        {job.title}
                      </CardTitle>
                      <div className="text-emerald-600 font-black text-lg">
                        ₦{Number(job.budget_max || job.budget).toLocaleString()}
                      </div>
                    </div>
                    <CardDescription className="line-clamp-2 text-slate-600 mt-2">
                      {job.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(Array.isArray(job.skills) ? job.skills : job.skills?.split(",") || [])
                        .slice(0, 3) // Show only first 3 skills to keep it clean
                        .map((skill, i) => (
                          <Badge key={i} variant="secondary" className="bg-slate-100 text-slate-600 border-none font-bold text-[10px] uppercase">
                            {skill.trim()}
                          </Badge>
                      ))}
                      {job.skills?.split(",").length > 3 && (
                        <span className="text-[10px] text-slate-400 font-bold self-center">
                          +{job.skills.split(",").length - 3} more
                        </span>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      <div className="flex gap-4">
                        <span className="flex items-center gap-1">
                          <MapPin size={14} className="text-emerald-500" /> {job.location || "Remote"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} className="text-emerald-500" /> {new Date(job.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded">
                        {job.proposal_count || 0} Proposals
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-dashed border-slate-200">
              <Briefcase className="mx-auto text-slate-300 mb-4" size={48} />
              <p className="text-slate-500 font-medium">No active jobs found at the moment.</p>
            </div>
          )}
        </div>

        <div className="text-center mt-12 md:hidden">
          <Link to="/search">
            <Button className="w-full bg-slate-900 text-white font-bold h-12 rounded-xl">
              View All Jobs
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}