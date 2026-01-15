"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { Label } from "../components/ui/Label";
import { Badge } from "../components/ui/Badge";
import { Avatar, AvatarFallback } from "../components/ui/Avatar";
import { Star, MapPin, Edit3, Save, Camera, Loader2, Globe } from "lucide-react";
import Footer from "../components/Footer";
import { updateProfile, getUserProfile } from "../api/api"; 
import { toast } from "sonner"; // Using your existing toaster

export default function FreelancerProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [profile, setProfile] = useState({
    full_name: "",
    title: "",
    location: "",
    hourlyRate: 0,
    bio: "",
    skills: "" // Keeping this as a string for easy text area editing
  });

  useEffect(() => {
    fetchLatestData();
  }, []);

  const fetchLatestData = async () => {
    try {
      const res = await getUserProfile();
      if (res.data) {
        setProfile({
          full_name: res.data.full_name || "",
          title: res.data.title || "Freelancer",
          location: res.data.location || "Nigeria",
          hourlyRate: res.data.hourlyRate || 0,
          bio: res.data.bio || "",
          skills: res.data.skills || "React, Node.js, Design" 
        });
      }
    } catch (err) {
      toast.error("Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile(profile);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "??";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900">My Profile</h1>
            <p className="text-slate-500">Manage how clients see you on the platform</p>
          </div>
          {!isEditing ? (
            
            <Button onClick={() => setIsEditing(true)} className="bg-slate-900 hover:bg-emerald-600 text-white gap-2 px-6 py-6 rounded-2xl shadow-xl shadow-emerald-100 hover:shadow-emerald-200 hover:-translate-y-1 transition-all duration-300 border-none"
            >
              <Edit3 className="w-4 h-4 mr-2" /> Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setIsEditing(false)} disabled={isSaving}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 rounded-xl px-6" disabled={isSaving}>
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                Save Changes
              </Button>
            </div>
          )}
        </div>

        <Card className="border-none shadow-xl shadow-slate-200/50 overflow-hidden rounded-[2rem]">
          <div className="h-32 bg-gradient-to-r from-emerald-500 to-teal-600" />
          <CardContent className="p-8 md:p-12 -mt-16">
            <div className="flex flex-col md:flex-row gap-10">
              
              <div className="flex flex-col items-center shrink-0">
                <div className="relative group">
                  <Avatar className="w-40 h-40 border-[6px] border-white shadow-2xl rounded-[2.5rem]">
                    <AvatarFallback className="text-4xl font-black bg-emerald-50 text-emerald-700">
                      {getInitials(profile.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <div className="absolute inset-0 bg-black/40 rounded-[2.5rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                      <Camera className="text-white w-8 h-8" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 space-y-8">
                {isEditing ? (
                  <div className="grid gap-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="font-bold ml-1">Display Name</Label>
                        <Input name="full_name" value={profile.full_name} onChange={handleChange} className="rounded-xl border-slate-200" />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold ml-1">Professional Title</Label>
                        <Input name="title" value={profile.title} onChange={handleChange} className="rounded-xl border-slate-200" />
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="font-bold ml-1">Location</Label>
                        <Input name="location" value={profile.location} onChange={handleChange} className="rounded-xl border-slate-200" />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold ml-1">Hourly Rate (₦)</Label>
                        <Input name="hourlyRate" type="number" value={profile.hourlyRate} onChange={handleChange} className="rounded-xl border-slate-200" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="font-bold ml-1">Professional Bio</Label>
                      <Textarea name="bio" value={profile.bio} onChange={handleChange} className="min-h-[120px] rounded-2xl border-slate-200" />
                    </div>

                    <div className="space-y-2">
                      <Label className="font-bold ml-1">Skills (Comma separated)</Label>
                      <Input name="skills" value={profile.skills} onChange={handleChange} placeholder="e.g. React, Python, UI Design" className="rounded-xl border-slate-200" />
                    </div>
                  </div>
                ) : (
                  <div className="animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                          {profile.full_name || "Account Name"}
                        </h2>
                        <p className="text-xl text-emerald-600 font-bold mt-2 flex items-center gap-2">
                          <Globe className="w-5 h-5" /> {profile.title}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-black text-slate-900">₦{Number(profile.hourlyRate).toLocaleString()}</p>
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Per Hour</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-6 mt-6 text-slate-500 font-medium">
                      <span className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg text-sm">
                        <MapPin className="w-4 h-4 text-emerald-500" /> {profile.location}
                      </span>
                      <span className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg text-sm">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400 border-none" /> Top Rated
                      </span>
                    </div>

                    <div className="mt-8">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">About Me</h3>
                      <p className="text-slate-600 leading-relaxed text-lg italic">
                        "{profile.bio || "No professional summary added yet. Click edit to introduce yourself to clients!"}"
                      </p>
                    </div>

                    <div className="mt-10">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Skills & Expertise</h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.skills.split(',').map(skill => (
                          <Badge key={skill} className="bg-emerald-50 text-emerald-700 border-none px-4 py-2 rounded-xl font-bold">
                            {skill.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}