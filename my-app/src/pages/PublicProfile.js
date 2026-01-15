"use client";

import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getPublicProfile } from "../api/api";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Star, ArrowLeft, ShieldCheck, MapPin, CheckCircle } from "lucide-react";
import ChatButton from "../components/ChatButton";

export default function PublicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await getPublicProfile(id);
        if (res.data) {
          setProfile(res.data);
          setError(null);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("User not found");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProfile();
  }, [id]);

  const handleHireClick = () => {
    navigate(`/create-offer/${profile.id}`, { 
      state: { freelancerName: profile.full_name, rate: profile.hourlyRate } 
    });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="animate-pulse text-emerald-600 font-bold">Loading expert profile...</div>
    </div>
  );
  
  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center p-8 bg-white rounded-3xl shadow-sm">
          <h2 className="text-2xl font-black text-slate-800 mb-4">{error || "User not found"}</h2>
          <Link to="/">
            <Button className="bg-emerald-600 hover:bg-emerald-700">Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Navigation Header */}
        <div className="flex justify-between items-center mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="hover:bg-white text-slate-600">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to listings
          </Button>
          <Badge className="bg-emerald-50 text-emerald-700 border-none px-3 py-1 font-bold">
            Available Now
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT SIDEBAR: Personal Details */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-none shadow-sm text-center p-8 bg-white rounded-3xl">
              <div className="relative w-32 h-32 mx-auto mb-6">
                <div className="w-full h-full bg-emerald-600 rounded-3xl flex items-center justify-center text-white text-4xl font-bold shadow-xl shadow-emerald-100 overflow-hidden">
                  {profile.profile_image ? (
                    <img src={profile.profile_image} alt={profile.full_name} className="object-cover w-full h-full" />
                  ) : (
                    profile.full_name?.charAt(0)
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-full shadow-md">
                  <CheckCircle className="text-emerald-500 w-6 h-6 fill-white" />
                </div>
              </div>

              <h1 className="text-2xl font-black text-slate-900 leading-tight">{profile.full_name}</h1>
              <p className="text-emerald-600 font-bold text-sm uppercase tracking-wider mt-2">{profile.title}</p>
              
              <div className="flex items-center justify-center gap-1 text-amber-400 mt-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="fill-current h-4 w-4" />)}
                <span className="text-slate-900 font-black ml-1">5.0</span>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-50 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-xs font-bold uppercase">Location</span>
                  <span className="font-bold text-slate-700 flex items-center gap-1">
                    <MapPin size={14} className="text-emerald-500" /> {profile.location || "Nigeria"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-xs font-bold uppercase">Hourly Rate</span>
                  <span className="font-black text-emerald-700 text-lg">
                    ₦{Number(profile.hourlyRate || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <Button onClick={handleHireClick} className="w-full bg-slate-900 hover:bg-emerald-600 text-white font-bold h-12 rounded-2xl transition-all">
                  Hire {profile.full_name?.split(' ')[0]}
                </Button>
                
                {/* Fixed Chat Interaction */}
                <ChatButton
                  otherUser={{
                    id: profile.id?.toString(),
                    name: profile.full_name,
                    avatar: profile.profile_image || profile.full_name?.charAt(0),
                    role: "freelancer",
                  }}
                  projectTitle="General Inquiry"
                />
              </div>
            </Card>

            <Card className="border-none shadow-sm p-6 bg-white rounded-3xl">
              <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest mb-4">Verifications</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                  <ShieldCheck size={18} className="text-emerald-500" /> Identity Verified
                </div>
                <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                  <ShieldCheck size={18} className="text-emerald-500" /> Payment Verified
                </div>
              </div>
            </Card>
          </div>

          {/* RIGHT CONTENT: Professional Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-sm p-10 bg-white rounded-3xl">
              <h2 className="text-xl font-black text-slate-900 mb-6">Professional Summary</h2>
              <p className="text-slate-600 leading-relaxed text-lg italic font-medium">
                "{profile.bio || "This expert hasn't updated their biography yet."}"
              </p>

              <div className="mt-10 pt-10 border-t border-slate-50">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Expertise & Stack</h3>
                <div className="flex flex-wrap gap-3">
                  {profile.bio?.includes(',') ? (
                    profile.bio.split(',').map((skill, i) => (
                      <Badge key={i} className="bg-slate-50 text-slate-600 border border-slate-100 px-4 py-2 rounded-xl text-sm font-bold">
                        {skill.trim()}
                      </Badge>
                    ))
                  ) : (
                    <Badge className="bg-emerald-50 text-emerald-700 border-none px-4 py-2 rounded-xl text-sm font-bold">
                      {profile.title}
                    </Badge>
                  )}
                </div>
              </div>
            </Card>

            <Card className="border-none shadow-sm p-10 bg-white rounded-3xl">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-black text-slate-900">Recent Portfolio</h2>
                <Button variant="ghost" className="text-emerald-600 font-bold">View All</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="aspect-video bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 font-bold italic">
                  Project Showcase Pending
                </div>
                <div className="aspect-video bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 font-bold italic">
                  Project Showcase Pending
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}