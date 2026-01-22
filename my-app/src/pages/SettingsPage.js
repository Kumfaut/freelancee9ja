"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Switch } from "../components/ui/Switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/Tabs";
import { 
  Bell, Lock, CreditCard, User, Shield, 
  Eye, EyeOff, Trash2, LogOut, Camera 
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

export default function SettingsPage({ onNavigate }) {
  const { user, logout } = useAuth();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [accountSettings, setAccountSettings] = useState({
    name: user?.full_name || "",
    email: user?.email || "",
    phone: user?.phone || "+234 ...",
    twoFactorEnabled: false,
    profileVisibility: "public"
  });

  useEffect(() => {
    if (user) {
      setAccountSettings(prev => ({
        ...prev,
        name: user.full_name || "",
        email: user.email || ""
      }));
    }
  }, [user]);

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    messageNotifications: true
  });

  const [paymentSettings, setPaymentSettings] = useState({
    defaultPaymentMethod: "bank",
    autoWithdraw: false,
    minimumBalance: 50000,
    bankName: "GTBank",
    accountNumber: "0123456789",
    accountName: user?.full_name || ""
  });

  const [privacySettings, setPrivacySettings] = useState({
    showEarnings: true,
    showOnlineStatus: true
  });

  const handleSaveSettings = () => {
    toast.success("Changes saved successfully!");
  };

  const handleSignOut = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      logout();
      if (onNavigate) onNavigate('login');
    }
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm("PERMANENT ACTION: Are you sure you want to delete your NaijaFreelance account?");
    if (confirmed) {
      toast.error("Account deletion request submitted.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-10">
      <div className="container mx-auto px-4 max-w-5xl">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
            <p className="text-slate-500">Manage your account and preferences.</p>
          </div>
          <Button variant="outline" onClick={handleSignOut} className="text-red-600 border-red-200">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="bg-white border p-1 shadow-sm grid grid-cols-5">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Alerts</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* --- ACCOUNT TAB --- */}
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-600">
                  <User className="w-5 h-5" />Profile Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                   <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center font-bold uppercase text-slate-600">
                        {accountSettings.name ? accountSettings.name.substring(0, 2) : "UN"}
                      </div>
                      <button className="absolute bottom-0 right-0 bg-emerald-600 text-white p-1 rounded-full">
                        <Camera className="w-3 h-3" />
                      </button>
                   </div>
                   <p className="text-sm text-slate-500">Update your profile picture</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input 
                      value={accountSettings.name} 
                      onChange={(e) => setAccountSettings(p => ({...p, name: e.target.value}))} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={accountSettings.email} disabled />
                  </div>
                </div>
                <Button onClick={handleSaveSettings} className="bg-emerald-600 text-white">Save Profile</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* --- NOTIFICATIONS TAB --- */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Email Alerts</Label>
                  <Switch 
                    checked={notificationSettings.emailNotifications} 
                    onCheckedChange={(v) => setNotificationSettings(p => ({...p, emailNotifications: v}))} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Push Notifications</Label>
                  <Switch 
                    checked={notificationSettings.pushNotifications} 
                    onCheckedChange={(v) => setNotificationSettings(p => ({...p, pushNotifications: v}))} 
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* --- PAYMENT TAB --- */}
          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />Bank Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg bg-slate-50">
                  <p className="font-bold">{paymentSettings.bankName}</p>
                  <p className="text-sm text-slate-500">****{paymentSettings.accountNumber.slice(-4)}</p>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Auto-Withdrawal</Label>
                  <Switch 
                    checked={paymentSettings.autoWithdraw} 
                    onCheckedChange={(v) => setPaymentSettings(p => ({...p, autoWithdraw: v}))} 
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* --- PRIVACY TAB --- */}
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Show Earnings on Profile</Label>
                  <Switch 
                    checked={privacySettings.showEarnings} 
                    onCheckedChange={(v) => setPrivacySettings(p => ({...p, showEarnings: v}))} 
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* --- SECURITY TAB --- */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />Change Password
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Input type={showCurrentPassword ? "text" : "password"} placeholder="Current Password" />
                  <button onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-3">
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="relative">
                  <Input type={showNewPassword ? "text" : "password"} placeholder="New Password" />
                  <button onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-3">
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <Button className="bg-emerald-600 text-white">Update Password</Button>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardHeader><CardTitle className="text-red-600">Danger Zone</CardTitle></CardHeader>
              <CardContent>
                <Button variant="destructive" onClick={handleDeleteAccount}>
                  <Trash2 className="w-4 h-4 mr-2" />Delete Account
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}