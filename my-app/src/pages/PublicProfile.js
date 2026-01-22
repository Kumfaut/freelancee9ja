"use client";

import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getPublicProfile } from "../api/api";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Star, ArrowLeft, ShieldCheck, MapPin, CheckCircle, Briefcase, FileText } from "lucide-react";
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

  // --- DYNAMIC CALCULATIONS ---
  const reviews = profile?.reviews || [];
  const reviewsCount = reviews.length;
  const averageRating = reviewsCount > 0 
    ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviewsCount).toFixed(1)
    : "0.0";

  const handleHireClick = () => {
    navigate(`/create-offer/${profile.id}`, { 
      state: { freelancerName: profile.full_name, rate: profile.hourlyRate } 
    });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        <div className="animate-pulse text-emerald-600 font-bold uppercase tracking-widest text-xs">Loading expert profile...</div>
      </div>
    </div>
  );
  
  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center p-8 bg-white rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-2xl font-black text-slate-800 mb-4">{error || "User not found"}</h2>
          <Link to="/">
            <Button className="bg-emerald-600 hover:bg-emerald-700 rounded-xl px-8">Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Navigation Header */}
        <div className="flex justify-between items-center mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="hover:bg-white text-slate-600 font-bold">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to listings
          </Button>
          <div className="flex gap-2">
            {averageRating >= 4.8 && reviewsCount > 0 && (
               <Badge className="bg-amber-100 text-amber-700 border-none px-3 py-1 font-black uppercase text-[10px]">
                Top Rated
              </Badge>
            )}
            <Badge className="bg-emerald-50 text-emerald-700 border-none px-3 py-1 font-bold">
              Available Now
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT SIDEBAR */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-none shadow-sm text-center p-8 bg-white rounded-3xl relative overflow-hidden">
              <div className="relative w-32 h-32 mx-auto mb-6">
                <div className="w-full h-full bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-white text-4xl font-bold shadow-xl overflow-hidden border-4 border-white">
                  {profile.profile_image ? (
                    <img src={profile.profile_image} alt={profile.full_name} className="object-cover w-full h-full" />
                  ) : (
                    profile.full_name?.charAt(0)
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full shadow-lg">
                  <CheckCircle className="text-emerald-500 w-6 h-6 fill-white" />
                </div>
              </div>

              <h1 className="text-2xl font-black text-slate-900 leading-tight">{profile.full_name}</h1>
              <p className="text-emerald-600 font-bold text-xs uppercase tracking-widest mt-2">{profile.title}</p>
              
              <div className="flex flex-col items-center mt-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className={i < Math.round(averageRating) ? "fill-current" : "text-slate-200"} />
                  ))}
                  <span className="text-slate-900 font-black ml-1 text-lg">{averageRating}</span>
                </div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-tighter">from {reviewsCount} reviews</p>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-50 space-y-4 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Location</span>
                  <span className="font-bold text-slate-700 flex items-center gap-1">
                    <MapPin size={14} className="text-emerald-500" /> {profile.location || "Nigeria"}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Hourly Rate</span>
                  <span className="font-black text-slate-900">
                    ₦{Number(profile.hourlyRate || 0).toLocaleString()}
                  </span>
                </div>

                {/* Fixed CV Button Placement */}
                {profile.cv_url && (
                  <div className="pt-2">
                    <a 
                      href={`http://localhost:5000/${profile.cv_url.replace(/\\/g, '/')}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block w-full"
                    >
                      <Button variant="outline" className="w-full border-slate-200 text-slate-600 font-bold h-11 rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                        <FileText size={16} className="text-emerald-600" />
                        View Resume / CV
                      </Button>
                    </a>
                  </div>
                )}
              </div>

              <div className="mt-8 space-y-3">
                <Button onClick={handleHireClick} className="w-full bg-slate-900 hover:bg-black text-white font-bold h-12 rounded-2xl transition-all shadow-md">
                  Hire {profile.full_name?.split(' ')[0]}
                </Button>
                
                <ChatButton
                  otherUser={{
                    id: profile.id?.toString(),
                    name: profile.full_name,
                    avatar: profile.profile_image || profile.full_name?.charAt(0),
                    role: "freelancer",
                  }}
                  projectTitle="New Project Discussion"
                />
              </div>
            </Card>

            <Card className="border-none shadow-sm p-6 bg-white rounded-3xl">
              <h3 className="font-black text-slate-900 text-[10px] uppercase tracking-widest mb-4">Verifications</h3>
              <div className="space-y-3">
                {['Identity', 'Payment', 'Phone'].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-slate-600 text-sm font-bold">
                    <ShieldCheck size={18} className="text-emerald-500" /> {item} Verified
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* RIGHT CONTENT */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-sm p-10 bg-white rounded-3xl">
              <h2 className="text-xl font-black text-slate-900 mb-6">About the Expert</h2>
              <p className="text-slate-600 leading-relaxed text-lg font-medium whitespace-pre-wrap">
                {profile.bio || "No biography provided."}
              </p>

              <div className="mt-10 pt-10 border-t border-slate-50">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Core Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.bio?.includes(',') ? (
                    profile.bio.split(',').map((skill, i) => (
                      <Badge key={i} className="bg-slate-100 text-slate-700 border-none px-4 py-2 rounded-xl text-xs font-bold">
                        {skill.trim()}
                      </Badge>
                    ))
                  ) : (
                    <Badge className="bg-emerald-50 text-emerald-700 border-none px-4 py-2 rounded-xl text-xs font-bold">
                      {profile.title}
                    </Badge>
                  )}
                </div>
              </div>
            </Card>

            <Card className="border-none shadow-sm p-10 bg-white rounded-3xl">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black text-slate-900">Work History & Reviews</h2>
                <div className="bg-slate-50 px-4 py-2 rounded-2xl flex items-center gap-2">
                   <Star className="fill-amber-400 text-amber-400 h-4 w-4" />
                   <span className="font-black text-slate-900">{averageRating}</span>
                </div>
              </div>

              <div className="space-y-8">
                {reviews.length > 0 ? (
                  reviews.map((rev, i) => (
                    <div key={i} className="border-b border-slate-50 last:border-0 pb-8 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-black text-slate-900">{rev.reviewer_name}</p>
                          <div className="flex gap-0.5 mt-1">
                            {[...Array(5)].map((_, starIndex) => (
                              <Star 
                                key={starIndex} 
                                size={12} 
                                className={starIndex < rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"} 
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          {new Date(rev.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm italic leading-relaxed">"{rev.comment}"</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <Briefcase className="mx-auto text-slate-300 mb-3" size={32} />
                    <p className="text-slate-400 font-bold italic">No reviews yet for this expert.</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}