"use client";

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getPublicProfile } from "../api/api";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { 
  Star, 
  ArrowLeft, 
  MapPin, 
  CheckCircle, 
  Briefcase, 
  Globe, 
  ShieldCheck, 
  FileText 
} from "lucide-react";
import ChatButton from "../components/ChatButton";

export default function PublicProfile() {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorState, setErrorState] = useState(null); // Renamed to avoid confusion

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await getPublicProfile(id);
        if (res.data) {
          setProfile(res.data);
          setErrorState(null);
        }
      } catch (err) {
        setErrorState(t('profile_not_found'));
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProfile();
  }, [id, t]);

  const reviews = profile?.reviews || [];
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-emerald-600"></div>
        <div className="text-emerald-600 font-black uppercase tracking-widest text-[10px]">{t('profile_loading')}</div>
      </div>
    </div>
  );

  if (errorState) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="text-center p-12 bg-white rounded-[2.5rem] shadow-xl border border-slate-100 max-w-sm w-full mx-4">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Briefcase className="text-red-400" size={32} />
        </div>
        <h2 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">{errorState}</h2>
        <Button onClick={() => navigate('/')} className="mt-4 bg-slate-900 text-white rounded-xl px-8 font-bold uppercase text-xs tracking-widest">
          {t('profile_return_home')}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Fixed Header */}
      <div className="bg-white border-b border-slate-200 py-4 sticky top-0 z-40 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Button variant="ghost" onClick={() => navigate(-1)} className="text-slate-500 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50">
            <ArrowLeft className="mr-2 h-4 w-4" /> {t('profile_back_list')}
          </Button>
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full border border-slate-200">
                <Globe className="w-3 h-3 text-slate-500" />
                <select 
                    className="text-[10px] font-black uppercase bg-transparent outline-none cursor-pointer"
                    value={i18n.language}
                    onChange={(e) => i18n.changeLanguage(e.target.value)}
                >
                    <option value="en">EN</option>
                    <option value="pcm">PCM</option>
                    <option value="yo">YO</option>
                    <option value="ha">HA</option>
                    <option value="ig">IG</option>
                </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-none shadow-sm text-center p-8 bg-white rounded-[2.5rem]">
              <div className="relative w-32 h-32 mx-auto mb-6">
                <div className="w-full h-full bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-white text-4xl font-bold shadow-2xl overflow-hidden border-4 border-white">
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

              <h1 className="text-2xl font-black text-slate-900 leading-tight uppercase tracking-tighter">{profile.full_name}</h1>
              <p className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.2em] mt-2">{profile.title}</p>
              
              <div className="flex flex-col items-center mt-6 p-4 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-1 text-amber-400 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className={i < Math.round(averageRating) ? "fill-current" : "text-slate-200"} />
                  ))}
                  <span className="text-slate-900 font-black ml-1 text-lg">{averageRating}</span>
                </div>
                <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest">{t('profile_from')} {reviews.length} {t('profile_reviews')}</p>
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-black uppercase text-[10px] tracking-widest">{t('location_label')}</span>
                  <span className="font-bold text-slate-900 flex items-center gap-1">
                    <MapPin size={14} className="text-emerald-500" /> {profile.location || "Nigeria"}
                  </span>
                </div>

                {profile.cv_url && (
                  <a 
                    href={`http://localhost:5000/${profile.cv_url.replace(/\\/g, '/')}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-black text-[10px] uppercase tracking-widest hover:border-emerald-500 hover:text-emerald-600 transition-all"
                  >
                    <FileText size={14} /> {t('profile_resume_btn')}
                  </a>
                )}
                
                <Button 
                  onClick={() => navigate(`/create-offer/${profile.id}`)} 
                  className="w-full bg-slate-900 hover:bg-emerald-600 text-white font-black h-14 rounded-2xl transition-all shadow-xl uppercase text-[10px] tracking-widest"
                >
                  {t('profile_hire_btn')}
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

            <Card className="border-none shadow-sm p-6 bg-white rounded-[2rem]">
              <h3 className="font-black text-slate-900 text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-500" /> {t('profile_verification')}
              </h3>
              <div className="space-y-3">
                {['Identity', 'Payment', 'Phone'].map((item) => (
                  <div key={item} className="flex items-center justify-between text-slate-600 text-xs font-bold">
                    <span>{item}</span>
                    <Badge className="bg-emerald-50 text-emerald-600 text-[9px] border-none">{t('profile_verified')}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-sm p-10 bg-white rounded-[2.5rem]">
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-6">{t('profile_about')}</h2>
              <p className="text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">
                {profile.bio || t('profile_no_bio')}
              </p>

              <div className="mt-10 pt-10 border-t border-slate-50">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">{t('profile_skills')}</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills_list?.length > 0 ? (
                    profile.skills_list.map((skill, i) => (
                      <Badge key={i} className="bg-slate-50 text-slate-600 border-none px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <Badge className="bg-emerald-50 text-emerald-600 border-none px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
                      {profile.title}
                    </Badge>
                  )}
                </div>
              </div>
            </Card>

            <Card className="border-none shadow-sm p-10 bg-white rounded-[2.5rem]">
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-8">{t('profile_history')}</h2>
              <div className="space-y-8">
                {reviews.length > 0 ? (
                  reviews.map((rev, i) => (
                    <div key={i} className="group border-b border-slate-50 last:border-0 pb-8 last:pb-0">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 font-black uppercase text-xs">
                                {rev.reviewer_name?.charAt(0)}
                            </div>
                            <div>
                                <p className="font-black text-slate-900 uppercase text-[10px] tracking-widest">{rev.reviewer_name}</p>
                                <div className="flex gap-0.5 mt-1">
                                    {[...Array(5)].map((_, starIndex) => (
                                      <Star key={starIndex} size={10} className={starIndex < rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-100 fill-slate-100"} />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                          {new Date(rev.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm italic font-medium leading-relaxed">"{rev.comment}"</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-100">
                    <Briefcase className="mx-auto text-slate-200 mb-4" size={48} />
                    <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">{t('profile_no_reviews')}</p>
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