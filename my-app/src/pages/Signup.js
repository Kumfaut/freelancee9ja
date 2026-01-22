"use client";

import React, { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Checkbox } from "../components/ui/Checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/Select";
import { User, Mail, Phone, MapPin, Lock, ArrowLeft, Loader2, Check, X } from "lucide-react";
import { useAuth } from "../context/AuthContext"; 
import { registerUser } from "../api/api"; 
import { toast } from "sonner";

export default function SignUpPage() {
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
    "Lagos", "Abuja (FCT)", "Rivers", "Kano", "Oyo", "Enugu", "Kaduna", "Ogun"
  ];

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (passwordScore < 4) {
      toast.error("Please meet all password requirements");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
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

      // Handle Immediate Login
      if (token) localStorage.setItem("token", token);
      login(user);
      
      toast.success("Account created successfully!");
      navigate(user.role === 'client' ? "/client-dashboard" : "/freelancer-dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <Link to="/" className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-emerald-100">
              N
            </div>
          </Link>
          <h1 className="text-3xl font-black text-slate-900">Join NaijaFreelance</h1>
        </div>

        {!userType ? (
          <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4">
            <SelectionCard emoji="💼" title="Work as a Freelancer" onClick={() => setUserType("freelancer")} />
            <SelectionCard emoji="🏢" title="Hire Talent" onClick={() => setUserType("client")} />
          </div>
        ) : (
          <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between bg-slate-50/50 p-6">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-emerald-600">
                {userType} Account
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setUserType("")} className="text-slate-400 font-bold">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            </CardHeader>
            <CardContent className="p-8 space-y-5">
              <form onSubmit={handleSignUp} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-bold"><User className="inline w-3 h-3 mr-1" /> First Name</Label>
                    <Input className="h-11 rounded-xl" placeholder="Adebayo" value={formData.firstName} onChange={(e) => handleInputChange("firstName", e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold"><User className="inline w-3 h-3 mr-1" /> Last Name</Label>
                    <Input className="h-11 rounded-xl" placeholder="Okafor" value={formData.lastName} onChange={(e) => handleInputChange("lastName", e.target.value)} required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-bold"><Mail className="inline w-3 h-3 mr-1" /> Email</Label>
                  <Input type="email" className="h-11 rounded-xl" placeholder="name@email.com" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} required />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-bold"><Phone className="inline w-3 h-3 mr-1" /> Phone</Label>
                    <Input className="h-11 rounded-xl" placeholder="080..." value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold"><MapPin className="inline w-3 h-3 mr-1" /> State</Label>
                    <Select onValueChange={(val) => handleInputChange("location", val)}>
                      <SelectTrigger className="h-11 rounded-xl">
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                      <SelectContent>
                        {nigerianStates.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-bold"><Lock className="inline w-3 h-3 mr-1" /> Password</Label>
                    <Input type="password" className="h-11 rounded-xl" value={formData.password} onChange={(e) => handleInputChange("password", e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold"><Lock className="inline w-3 h-3 mr-1" /> Confirm Password</Label>
                    <Input type="password" className="h-11 rounded-xl" value={formData.confirmPassword} onChange={(e) => handleInputChange("confirmPassword", e.target.value)} required />
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl space-y-2">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Requirements</p>
                  <div className="grid grid-cols-2 gap-2">
                    {passwordRequirements.map((req, i) => (
                      <div key={i} className={`flex items-center gap-2 text-xs font-bold ${req.test(formData.password) ? 'text-emerald-600' : 'text-slate-300'}`}>
                        {req.test(formData.password) ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />} {req.label}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-start space-x-2 py-2">
                  <Checkbox id="terms" checked={formData.agreeToTerms} onCheckedChange={(v) => handleInputChange("agreeToTerms", v)} required />
                  <Label htmlFor="terms" className="text-xs text-slate-500 font-medium">I agree to the Terms of Service</Label>
                </div>

                <Button type="submit" className="w-full bg-slate-900 h-12 rounded-xl font-black text-white hover:bg-emerald-600 transition-all" disabled={isLoading}>
                  {isLoading ? <Loader2 className="animate-spin" /> : "Create My Account"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function SelectionCard({ emoji, title, onClick }) {
  return (
    <Card className="cursor-pointer group hover:border-emerald-500 border-2 transition-all shadow-sm rounded-3xl" onClick={onClick}>
      <CardContent className="p-8 text-center">
        <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{emoji}</div>
        <h3 className="font-black text-lg text-slate-900">{title}</h3>
      </CardContent>
    </Card>
  );
}