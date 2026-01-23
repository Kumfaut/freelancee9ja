"use client";

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { MapPin, Clock, Users, Star, Briefcase, Calendar, Heart, Languages } from "lucide-react";
import { toggleSaveJob } from "../api/api";
import { toast } from "sonner";
import { useTranslation } from 'react-i18next';
import { translateDynamicContent } from '../utils/translateUtil';

export default function JobCard({ job, formatBudget }) {
  const { i18n, t } = useTranslation();
  
  // States
  const [isSaved, setIsSaved] = useState(job?.isSaved || false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [translatedDesc, setTranslatedDesc] = useState(job?.description);
  const [isTranslating, setIsTranslating] = useState(false);

  // Sync description if job changes
  useEffect(() => {
    setTranslatedDesc(job?.description);
  }, [job?.description]);

  const handleTranslate = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    setIsTranslating(true);
    try {
      // Use current i18n language (ha, ig, yo, etc.)
      const targetLang = i18n.language || 'en';
      const result = await translateDynamicContent(job.description, targetLang);
      setTranslatedDesc(result);
      toast.success("Translation complete");
    } catch (error) {
      console.error("Translation error:", error);
      toast.error("Could not translate at this time");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSaveToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsSubmitting(true);
    try {
      const response = await toggleSaveJob(job.id);
      if (response.data.success) {
        setIsSaved(response.data.saved);
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
    <Card className="hover:shadow-md transition-shadow relative overflow-hidden">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Link to={`/job/${job.id}`} className="hover:text-emerald-600 transition-colors">
                <CardTitle className="text-lg">{job.title}</CardTitle>
              </Link>
              
              {job.featured && (
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                  {t('featured_label', 'Featured')}
                </Badge>
              )}
              {job.urgent && <Badge variant="destructive" className="text-xs">Urgent</Badge>}
              {job.verified && <span className="text-emerald-600" title="Verified Client">✓</span>}
            </div>
            <div className="flex items-center gap-4 mb-2">
              <div className="text-emerald-600 font-semibold">
                {formatBudget ? formatBudget(job) : `₦${job.budget_max}`}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                {job.clientRating?.toFixed(1) || "New"}
              </div>
            </div>
          </div>

          <Button 
            variant="outline" 
            disabled={isSubmitting}
            onClick={handleSaveToggle}
            className={`ml-4 transition-all duration-300 ${
              isSaved ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100" : "hover:bg-slate-50"
            }`}
          >
            <Heart className={`w-4 h-4 mr-2 ${isSaved ? "fill-current" : ""}`} />
            {isSaved ? t('saved_label', 'Saved') : t('save_label', 'Save')}
          </Button>
        </div>
        
        <div className="space-y-2">
          <CardDescription className="text-base leading-relaxed line-clamp-3">
            {translatedDesc}
          </CardDescription>
          
          {/* Natural Toggle: Only shows if NOT English */}
          {i18n.language && !i18n.language.startsWith('en') && (
            <button 
              onClick={handleTranslate}
              disabled={isTranslating}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 underline decoration-dotted"
            >
              <Languages className="w-3 h-3" />
              {isTranslating ? "Translating..." : "See Translation"}
            </button>
          )}
        </div>
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
        
        <div className="flex justify-between items-center border-t pt-4">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{job.proposals || 0} proposals</span>
          </div>
          
          <div className="flex gap-2">
             <Link to={`/job/${job.id}`}>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                    {t('view_apply_btn', 'View & Apply')}
                </Button>
             </Link>
          </div>
        </div>

        {/* --- DEBUG BOX: REMOVE THIS ONCE WORKING --- */}
        <div className="mt-6 p-3 bg-slate-100 border border-slate-300 rounded text-center">
            <p className="text-[10px] uppercase font-bold text-slate-500 mb-2">Developer Tools</p>
            <Button 
                onClick={handleTranslate} 
                variant="outline" 
                size="sm" 
                className="w-full text-xs"
                disabled={isTranslating}
            >
                {isTranslating ? "Wait..." : `Force Translate (Current: ${i18n.language})`}
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}