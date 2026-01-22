"use client";

import React, { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Checkbox } from "../components/ui/Checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/Select";
import { User, Mail, Phone, MapPin, Lock, ArrowLeft, Loader2, Check, X, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext"; 
import { registerUser } from "../api/api"; 
import { toast } from "sonner";

/**
 * COMPONENT: LanguageToggle
 * Allows users to switch between the 5 supported languages
 */
function LanguageToggle() {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'pcm', label: 'Pidgin', flag: '🇳🇬' },
    { code: 'yo', label: 'Yorùbá', flag: '🇳🇬' },
    { code: 'ig', label: 'Ígbò', flag: '🇳🇬' },
    { code: 'ha', label: 'Hausa', flag: '🇳🇬' },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-2 mb-8">
      {languages.map((lang) => (
        <button
          key={lang.code}
          type="button"
          onClick={() => i18n.changeLanguage(lang.code)}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
            i18n.language === lang.code
              ? "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-100"
              : "bg-white border-slate-200 text-slate-600 hover:border-emerald-300"
          }`}
        >
          <span className="mr-1">{lang.flag}</span> {lang.label}
        </button>
      ))}
    </div>
  );
}

/**
 * COMPONENT: SelectionCard
 * Displayed at the start to choose between Freelancer or Client
 */
function SelectionCard({ emoji, title, description, onClick }) {
  return (
    <Card 
      className="cursor-pointer group hover:border-emerald-500 hover:bg-emerald-50/30 border-2 border-transparent transition-all shadow-md hover:shadow-emerald-100 rounded-[2.5rem] bg-white ring-1 ring-slate-100" 
      onClick={onClick}
    >
      <CardContent className="p-10 text-center space-y-4">
        <div className="text-6xl mb-2 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300 inline-block">
          {emoji}
        </div>
        <div className="space-y-1">
          <h3 className="font-black text-xl text-slate-900 tracking-tight">{title}</h3>
          <p className="text-sm text-slate-400 font-medium">{description}</p>
        </div>
        <div className="pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center justify-center gap-1">
            Get Started <ArrowLeft className="w-3 h-3 rotate-180" />
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * MAIN PAGE COMPONENT: SignUpPage
 */
export default function SignUpPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth(); 
  
  const [userType, setUserType] = useState(""); 
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "",
    password: "", confirmPassword: "",
    phone: "", location: "", agreeToTerms: false
  });

  const passwordRequirements = useMemo(() => [
    { label: "8+ Characters", test: (pw) => pw.length >= 8 },
    { label: "One Number", test: (pw) => /\d/.test(pw) },
    { label: "Special Char", test: (pw) => /[!@#$%^&*]/.test(pw) },
    { label: "Uppercase", test: (pw) => /[A-Z]/.test(pw) },
  ], []);

  const passwordScore = passwordRequirements.filter(req => req.test(formData.password)).length;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nigerianStates = [
    "Abuja (FCT)", "Lagos", "Rivers", "Kano", "Oyo", "Enugu", "Kaduna", "Ogun", "Delta", "Anambra"
  ].sort();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (passwordScore < 4) {
      toast.error("Security: Please meet all password requirements");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Password mismatch: Please check again");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        full_name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        password: formData.password,
        role: userType,
        phone: formData.phone,
        location: formData.location
      };

      const response = await registerUser(payload);
      const { token, user } = response.data;

      if (token) localStorage.setItem("token", token);
      login(user, token);
      
      toast.success(`Welcome to the community, ${formData.firstName}!`);
      navigate(user.role === 'client' ? "/client-dashboard" : "/freelancer-dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 selection:bg-emerald-100">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Progress Header */}
        <div className="text-center">
          <Link to="/" className="inline-block transition-transform hover:scale-105 active:scale-95 mb-6">
            <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-emerald-200/50">
              N
            </div>
          </Link>

          {/* Language Toggle Placement */}
          <LanguageToggle />

          <h1 className="text-3xl font-black text-slate-900 tracking-tight">{t('create_account')}</h1>
          <p className="text-slate-500 mt-2 font-medium">{t('signup_subtitle')}</p>
        </div>

        {!userType ? (
          <div className="grid md:grid-cols-2 gap-6 animate-in fade-in zoom-in-95 duration-300">
            <SelectionCard 
              emoji="💼" 
              title={t('role_freelancer')} 
              description="I want to find work and earn money"
              onClick={() => setUserType("freelancer")} 
            />
            <SelectionCard 
              emoji="🏢" 
              title={t('role_client')} 
              description="I want to hire talent for projects"
              onClick={() => setUserType("client")} 
            />
          </div>
        ) : (
          <Card className="border-none shadow-2xl shadow-slate-200/60 rounded-[2.5rem] overflow-hidden bg-white ring-1 ring-slate-100 animate-in slide-in-from-right-4 duration-500">
            <CardHeader className="flex flex-row items-center justify-between bg-slate-50/80 p-6 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                  {userType} Account
                </CardTitle>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setUserType("")} className="text-slate-400 font-bold hover:text-slate-900 hover:bg-slate-200/50 rounded-full transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" /> {t('back')}
              </Button>
            </CardHeader>

            <CardContent className="p-8 md:p-10">
              <form onSubmit={handleSignUp} className="space-y-6">
                
                {/* Name Section */}
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="font-bold text-slate-700 ml-1">{t('first_name')}</Label>
                    <div className="relative group">
                      <User className="absolute left-4 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                      <Input className="h-12 pl-11 rounded-2xl border-slate-200 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm" placeholder="e.g. Adebayo" value={formData.firstName} onChange={(e) => handleInputChange("firstName", e.target.value)} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-slate-700 ml-1">{t('last_name')}</Label>
                    <div className="relative group">
                      <User className="absolute left-4 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                      <Input className="h-12 pl-11 rounded-2xl border-slate-200 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm" placeholder="e.g. Okafor" value={formData.lastName} onChange={(e) => handleInputChange("lastName", e.target.value)} required />
                    </div>
                  </div>
                </div>

                {/* Email Section */}
                <div className="space-y-2">
                  <Label className="font-bold text-slate-700 ml-1">{t('email_label')}</Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                    <Input type="email" className="h-12 pl-11 rounded-2xl border-slate-200 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm" placeholder="name@email.com" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} required />
                  </div>
                </div>

                {/* Contact & Location Section */}
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="font-bold text-slate-700 ml-1">{t('phone_label')}</Label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                      <Input className="h-12 pl-11 rounded-2xl border-slate-200 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm" placeholder="080 1234 5678" value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-slate-700 ml-1">{t('location_label')}</Label>
                    <Select onValueChange={(val) => handleInputChange("location", val)}>
                      <SelectTrigger className="h-12 rounded-2xl border-slate-200 shadow-sm focus:ring-emerald-500">
                        <div className="flex items-center">
                          <MapPin className="mr-3 h-4 w-4 text-slate-400" />
                          <SelectValue placeholder="Select State" />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {nigerianStates.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Password Section */}
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="font-bold text-slate-700 ml-1">{t('pass_label')}</Label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                      <Input type="password" className="h-12 pl-11 rounded-2xl border-slate-200 focus:ring-emerald-500 shadow-sm" value={formData.password} onChange={(e) => handleInputChange("password", e.target.value)} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-slate-700 ml-1">{t('confirm_password')}</Label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                      <Input type="password" className="h-12 pl-11 rounded-2xl border-slate-200 focus:ring-emerald-500 shadow-sm" value={formData.confirmPassword} onChange={(e) => handleInputChange("confirmPassword", e.target.value)} required />
                    </div>
                  </div>
                </div>

                {/* Enhanced Security Checklist */}
                <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1.5">
                      <ShieldCheck className="w-3 h-3" /> {t('security_strength')}
                    </p>
                    <div className="h-1.5 w-24 bg-slate-200 rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-500 ${passwordScore === 4 ? 'bg-emerald-500' : 'bg-orange-400'}`} style={{ width: `${(passwordScore/4)*100}%` }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {passwordRequirements.map((req, i) => (
                      <div key={i} className={`flex items-center gap-2 text-xs font-bold transition-colors ${req.test(formData.password) ? 'text-emerald-600' : 'text-slate-300'}`}>
                        <div className={`rounded-full p-0.5 ${req.test(formData.password) ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                          {req.test(formData.password) ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        </div>
                        {req.label}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-3 py-2 px-1">
                  <Checkbox id="terms" className="rounded-md border-slate-300 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600" checked={formData.agreeToTerms} onCheckedChange={(v) => handleInputChange("agreeToTerms", v)} required />
                  <Label htmlFor="terms" className="text-xs text-slate-500 font-medium cursor-pointer leading-tight">
                    {t('i_agree')} <Link to="/terms" className="text-emerald-600 hover:underline font-bold">{t('terms_service')}</Link>
                  </Label>
                </div>

                <Button type="submit" className="w-full bg-slate-900 h-14 rounded-2xl font-black text-white hover:bg-emerald-600 shadow-lg shadow-slate-200 hover:shadow-emerald-200/40 transition-all active:scale-[0.98]" disabled={isLoading}>
                  {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : t('signup_btn')}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <p className="text-center text-sm text-slate-500 font-medium">
          {t('already_have_account')}{" "}
          <Link to="/login" className="text-emerald-600 font-bold hover:underline ml-1">
            {t('login_btn')}
          </Link>
        </p>
      </div>
    </div>
  );
}