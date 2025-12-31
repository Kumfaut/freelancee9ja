"use client";

import React, { useState } from "react";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { Label } from "../components/ui/Label";
import { Badge } from "../components/ui/Badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/Avatar";
import { 
  Star, MapPin,  Edit3, Save, X, Camera, Plus
} from "lucide-react";
import Footer from "../components/Footer";

export default function FreelancerProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  
  // The "Source of Truth" for the profile data
  const [profile, setProfile] = useState({
    firstName: "Adebayo",
    lastName: "Oluwaseun",
    title: "Full Stack Developer & Mobile App Specialist",
    location: "Lagos",
    hourlyRate: 5000,
    bio: "I'm a passionate full-stack developer with over 7 years of experience building scalable applications. I specialize in React and Paystack integrations.",
    skills: ["React", "Node.js", "Paystack", "Tailwind CSS"]
  });

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // In a real app, you would send 'profile' to your database (Supabase/Firebase) here
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        
        {/* Header with Edit/Save Toggle */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} className="bg-emerald-600 gap-2">
              <Edit3 className="w-4 h-4" /> Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)} className="gap-2">
                <X className="w-4 h-4" /> Cancel
              </Button>
              <Button onClick={handleSave} className="bg-emerald-600 gap-2">
                <Save className="w-4 h-4" /> Save Changes
              </Button>
            </div>
          )}
        </div>

        <Card className="border-none shadow-sm overflow-hidden">
          <div className="h-24 bg-linear-to-r from-emerald-600 to-teal-500" />
          <CardContent className="p-8 -mt-10">
            <div className="flex flex-col md:flex-row gap-8">
              
              {/* Profile Photo Section */}
              <div className="flex flex-col items-center shrink-0">
                <div className="relative group">
                  <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-3xl bg-emerald-50 text-emerald-700">
                      {profile.firstName[0]}{profile.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Camera className="text-white w-6 h-6" />
                    </div>
                  )}
                </div>
              </div>

              {/* Form Fields */}
              <div className="flex-1 space-y-6">
                {isEditing ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>First Name</Label>
                      <Input name="firstName" value={profile.firstName} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label>Last Name</Label>
                      <Input name="lastName" value={profile.lastName} onChange={handleChange} />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label>Professional Title</Label>
                      <Input name="title" value={profile.title} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input name="location" value={profile.location} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label>Hourly Rate (₦)</Label>
                      <Input name="hourlyRate" type="number" value={profile.hourlyRate} onChange={handleChange} />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label>Short Bio</Label>
                      <Textarea 
                        name="bio" 
                        value={profile.bio} 
                        onChange={handleChange}
                        className="min-h-30"
                      />
                    </div>
                  </div>
                ) : (
                  /* Display Mode View */
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">{profile.firstName} {profile.lastName}</h2>
                    <p className="text-xl text-emerald-600 font-medium mt-1">{profile.title}</p>
                    
                    <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {profile.location}, NG</span>
                      <span className="flex items-center gap-1.5 font-bold text-slate-900">₦{profile.hourlyRate.toLocaleString()}/hr</span>
                      <span className="flex items-center gap-1.5"><Star className="w-4 h-4 fill-amber-400 text-amber-400" /> 4.9 (127 reviews)</span>
                    </div>

                    <div className="mt-6 text-slate-600 leading-relaxed">
                      <p>{profile.bio}</p>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {profile.skills.map(skill => (
                        <Badge key={skill} variant="secondary" className="bg-slate-100 text-slate-600">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Preview Section */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-900">My Portfolio</h3>
            {isEditing && (
              <Button variant="outline" size="sm" className="gap-1 text-emerald-600 border-emerald-200">
                <Plus className="w-4 h-4" /> Add Item
              </Button>
            )}
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-6 border-dashed border-2 border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center text-slate-400 h-40">
              <p className="text-sm">No projects added yet.</p>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}