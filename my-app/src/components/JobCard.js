"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { MapPin, Clock, Users, Star, Briefcase, Calendar, Heart } from "lucide-react";
import { toggleSaveJob } from "../api/api"; // Ensure this is imported
import { toast } from "sonner";

export default function JobCard({ job, formatBudget }) {
  // 1. Local state to track if the job is saved (defaults to job data from backend)
  const [isSaved, setIsSaved] = useState(job.isSaved || false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2. The Fix: Handle the toggle action
  const handleSaveToggle = async (e) => {
    e.preventDefault(); // Prevents link navigation
    e.stopPropagation(); // Prevents card click events
    
    setIsSubmitting(true);
    try {
      // Calls your API: API.post('/jobs/save', { job_id: jobId })
      const response = await toggleSaveJob(job.id);
      
      if (response.data.success) {
        setIsSaved(response.data.saved); // Updates UI based on backend 'saved' boolean
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error("Save error:", error);
      const errorMsg = error.response?.status === 401 
        ? "Please login to save jobs" 
        : "Could not save job";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Link to={`/job/${job.id}`} className="hover:text-emerald-600 transition-colors">
                <CardTitle className="text-lg">{job.title}</CardTitle>
              </Link>
              
              {job.featured && (
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                  Featured
                </Badge>
              )}
              {job.urgent && <Badge variant="destructive" className="text-xs">Urgent</Badge>}
              {job.verified && <span className="text-emerald-600" title="Verified Client">✓</span>}
            </div>
            <div className="flex items-center gap-4 mb-2">
              <div className="text-emerald-600 font-semibold">{formatBudget ? formatBudget(job) : `₦${job.budget_max}`}</div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                {job.clientRating?.toFixed(1) || "New"}
              </div>
            </div>
          </div>

          {/* 3. The Functional Save Button */}
          <Button 
            variant="outline" 
            disabled={isSubmitting}
            onClick={handleSaveToggle}
            className={`ml-4 transition-all duration-300 ${
              isSaved ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100" : "hover:bg-slate-50"
            }`}
          >
            <Heart className={`w-4 h-4 mr-2 ${isSaved ? "fill-current" : ""}`} />
            {isSaved ? "Saved" : "Save"}
          </Button>
        </div>
        <CardDescription className="text-base leading-relaxed line-clamp-2">
          {job.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {job.skills && job.skills.slice(0, 5).map((skill, index) => (
            <Badge key={index} variant="secondary">{skill}</Badge>
          ))}
          {job.skills?.length > 5 && <Badge variant="outline">+{job.skills.length - 5} more</Badge>}
        </div>
        
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {job.location}{job.state ? `, ${job.state}` : ""}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {job.timePosted || "Recently"}
          </div>
          <div className="flex items-center gap-1">
            <Briefcase className="w-4 h-4" />
            {job.experience_level || job.experienceLevel}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {job.duration}
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{job.proposals || 0} proposals</span>
          </div>
          
          <Link to={`/job/${job.id}`}>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
              View & Apply
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}