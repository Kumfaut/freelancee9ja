"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Switch } from "../components/ui/Switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/Tabs";
// Removed unused 'Badge' import
import { 
  Bell, Lock, User, 
  Eye, EyeOff, Trash2, LogOut, Camera,
  ShieldCheck, CheckCircle, FileText, Upload 
} from "lucide-react"; // Removed unused 'CreditCard', 'Shield'
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import API from "../api/api";

export default function SettingsPage({ onNavigate }) {
  const { user, setUser, logout } = useAuth();
  const { t } = useTranslation();
  
  // UI States
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false); // Now used below
  const [isVerifying, setIsVerifying] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Form States
  const [nin, setNin] = useState("");
  const [accountSettings, setAccountSettings] = useState({
    name: user?.full_name || "",
    email: user?.email || "",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
  });

  useEffect(() => {
    if (user) {
      setAccountSettings({
        name: user.full_name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  // --- HANDLERS ---

  const handleSaveProfile = async () => {
    try {
      // We only send 'name' because that's the only thing 
      // the user is allowed to change in this specific form section.
      await API.put("/users/profile/update", {
        name: accountSettings.name 
      });
      
      // Update global context so the Navbar/Sidebar name changes too
      setUser({ ...user, full_name: accountSettings.name });
      toast.success(t('profile_toast_success'));
    } catch (err) {
      console.error("Update Error:", err);
      toast.error("Failed to update profile");
    }
  };

  const handleCVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      return toast.error("Please upload a PDF document.");
    }

    const formData = new FormData();
    formData.append("cv", file);

    setIsUploading(true);
    try {
      const res = await API.post("/users/setup-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success("CV Uploaded Successfully!");
        setUser({ ...user, cv_url: res.data.cv_url });
      }
    } catch (err) {
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleNIMCVerify = async () => {
    if (nin.length !== 11) return toast.error("NIN must be 11 digits");

    setIsVerifying(true);
    try {
      const res = await API.post("/users/verify-nin", { nin_number: nin });
      if (res.data.success) {
        toast.success("Identity Verified!");
        setUser({ ...user, is_verified: 1 });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSignOut = () => {
    if (window.confirm(t('nav_logout') + "?")) {
      logout();
      if (onNavigate) onNavigate('login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-10">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{t('settings_title')}</h1>
            <p className="text-slate-500">{t('settings_subtitle')}</p>
          </div>
          <Button variant="outline" onClick={handleSignOut} className="text-red-600 border-red-200 hover:bg-red-50">
            <LogOut className="w-4 h-4 mr-2" /> {t('nav_logout')}
          </Button>
        </div>

        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="bg-white border p-1 shadow-sm grid grid-cols-3 md:grid-cols-6 h-auto">
            <TabsTrigger value="account">{t('tab_account')}</TabsTrigger>
            <TabsTrigger value="identity">Identity</TabsTrigger>
            <TabsTrigger value="notifications">{t('tab_alerts')}</TabsTrigger>
            <TabsTrigger value="payment">{t('tab_payment')}</TabsTrigger>
            <TabsTrigger value="privacy">{t('tab_privacy')}</TabsTrigger>
            <TabsTrigger value="security">{t('tab_security')}</TabsTrigger>
          </TabsList>

          {/* --- ACCOUNT & CV TAB --- */}
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-600">
                  <User className="w-5 h-5" />{t('profile_details')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                   <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center font-bold uppercase text-slate-600 border-2 border-white shadow-sm">
                        {user?.full_name?.substring(0, 2) || "UN"}
                      </div>
                      <button className="absolute bottom-0 right-0 bg-emerald-600 text-white p-1.5 rounded-full border-2 border-white shadow-lg">
                        <Camera className="w-3 h-3" />
                      </button>
                   </div>
                   <p className="text-xs text-slate-500 font-bold uppercase tracking-tight">Profile Photo</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t('full_name')}</Label>
                    <Input 
                      value={accountSettings.name} 
                      onChange={(e) => setAccountSettings(p => ({...p, name: e.target.value}))} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('email_label')}</Label>
                    <Input value={accountSettings.email} disabled className="bg-slate-50 cursor-not-allowed" />
                  </div>
                </div>
                <Button onClick={handleSaveProfile} className="bg-emerald-600 text-white px-8 h-12 rounded-xl font-bold uppercase text-[10px] tracking-widest">
                  {t('save_profile')}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-dashed border-slate-200 shadow-none bg-transparent">
              <CardHeader>
                <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-slate-600">
                  <FileText className="w-4 h-4" /> Professional Resume (CV)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user?.cv_url ? (
                  <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500">
                        <FileText size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-tight text-slate-900">Resume_Verified.pdf</p>
                        <p className="text-[9px] text-emerald-500 font-bold">Active on public profile</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Input type="file" id="cv-change" className="hidden" accept=".pdf" onChange={handleCVUpload} />
                      <label 
                      htmlFor="cv-change" 
                      className="cursor-pointer text-[10px] font-black uppercase text-slate-400 hover:text-emerald-600 transition-colors px-4 py-2"
                    >
                      Change
                    </label>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 bg-white rounded-3xl border border-slate-100 shadow-sm">
                    <Input type="file" id="cv-upload" className="hidden" accept=".pdf" onChange={handleCVUpload} />
                    <label htmlFor="cv-upload" className="flex flex-col items-center gap-3 cursor-pointer group">
                      <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all">
                        <Upload size={24} />
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">
                          {isUploading ? "Uploading..." : "Click to upload CV"}
                        </p>
                        <p className="text-[9px] text-slate-400 font-medium">PDF files only, max 5MB</p>
                      </div>
                    </label>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* --- IDENTITY TAB --- */}
          <TabsContent value="identity">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <ShieldCheck className="w-5 h-5" /> Identity Verification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {user?.is_verified ? (
                  <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-[2.5rem] flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-white text-emerald-500 rounded-full flex items-center justify-center mb-4 shadow-sm">
                      <CheckCircle size={32} />
                    </div>
                    <h3 className="text-emerald-900 font-black uppercase tracking-tight text-lg">Verified Account</h3>
                    <p className="text-emerald-600/70 text-xs font-medium max-w-xs mx-auto mt-2">
                      Your identity has been confirmed via NIMC. Your profile now features the trust badge.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                      <p className="text-[11px] text-blue-700 font-bold leading-relaxed">
                        Verify your identity using your 11-digit <span className="underline">National Identification Number</span> to increase client trust.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Enter NIN</Label>
                      <Input 
                        placeholder="00000000000" 
                        value={nin} 
                        maxLength={11}
                        className="text-lg tracking-[0.5em] font-mono h-14"
                        onChange={(e) => setNin(e.target.value.replace(/\D/g, ''))} 
                      />
                    </div>
                    <Button 
                      onClick={handleNIMCVerify} 
                      disabled={isVerifying || nin.length < 11}
                      className="bg-slate-900 text-white w-full md:w-auto h-12 px-10 rounded-xl font-black uppercase text-[10px] tracking-widest"
                    >
                      {isVerifying ? "Processing..." : "Verify with NIMC"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* --- NOTIFICATIONS TAB --- */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader><CardTitle className="text-sm uppercase tracking-widest font-black"><Bell className="inline mr-2 w-4 h-4" /> Notifications</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <Label className="text-xs font-bold">Email Alerts</Label>
                  <Switch checked={notificationSettings.emailNotifications} onCheckedChange={(v) => setNotificationSettings(p => ({...p, emailNotifications: v}))} />
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <Label className="text-xs font-bold">Push Notifications</Label>
                  <Switch checked={notificationSettings.pushNotifications} onCheckedChange={(v) => setNotificationSettings(p => ({...p, pushNotifications: v}))} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* --- SECURITY TAB --- */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="text-sm uppercase tracking-widest font-black"><Lock className="inline mr-2 w-4 h-4" /> Security</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current Password</Label>
                  <Input type={showCurrentPassword ? "text" : "password"} placeholder="••••••••" className="mt-1" />
                  <button onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-9.5 text-slate-400">
                    {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div className="relative">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">New Password</Label>
                  <Input type={showNewPassword ? "text" : "password"} placeholder="••••••••" className="mt-1" />
                  <button onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-9.5 text-slate-400">
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <Button className="bg-slate-900 text-white w-full h-12 rounded-xl text-[10px] font-black uppercase tracking-widest mt-2">Update Password</Button>
              </CardContent>
            </Card>

            <Card className="border-red-100 bg-red-50/10">
              <CardContent className="pt-6">
                <Button variant="destructive" onClick={() => toast.error("Action restricted.")} className="w-full md:w-auto font-black uppercase text-[10px] tracking-widest h-12">
                  <Trash2 className="w-4 h-4 mr-2" /> Delete Account
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}