"use client";

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Checkbox } from "../components/ui/Checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/Select";
import { Badge } from "../components/ui/Badge";
import { User, Mail, Phone, MapPin, Lock, ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext"; 
import { registerUser } from "../api/api"; 

export default function SignUpPage() {
  const navigate = useNavigate();
  const { login } = useAuth(); 
  
  const [userType, setUserType] = useState(""); 
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    location: "",
    agreeToTerms: false
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    // 1. Validations
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (!userType) {
      alert("Please select whether you are a Freelancer or a Client.");
      return;
    }

    setIsLoading(true);

    try {
      // 2. Prepare Backend Payload
      const payload = {
        full_name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        password: formData.password,
        role: userType,
        phone: formData.phone,
        location: formData.location
      };

      // 3. API Call
      const response = await registerUser(payload);
      
      // 4. CRITICAL FIX: Extract token and user
      const { token, user } = response.data;

      // 5. Store Token in LocalStorage immediately
      if (token) {
        localStorage.setItem("token", token);
      } else {
        console.warn("No token received from backend during registration");
      }

      // 6. Update Auth Context
      login(user);

      alert("Registration successful!");

      // 7. Role-based redirect
      if (userType === 'client') {
        navigate("/client-dashboard");
      } else {
        navigate("/freelancer-dashboard");
      }

    } catch (error) {
      console.error("Signup Error:", error.response?.data);
      const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const nigerianStates = [
    "Lagos", "Abuja (FCT)", "Rivers", "Kano", "Oyo", "Enugu", "Kaduna", 
    "Edo", "Delta", "Anambra", "Ogun", "Imo", "Akwa Ibom", "Osun", 
    "Ondo", "Ekiti", "Kwara", "Cross River", "Abia", "Plateau"
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        
        <div className="text-center">
          <Link to="/" className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-xl shadow-emerald-100">
              N
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Join NaijaFreelance</h1>
        </div>

        {!userType && (
          <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SelectionCard 
              emoji="💼"
              title="Work as a Freelancer"
              description="Find projects and build your portfolio."
              badges={["Flexible", "Global Reach"]}
              onClick={() => setUserType("freelancer")}
            />
            <SelectionCard 
              emoji="🏢"
              title="Hire Talent"
              description="Post projects and find professionals."
              badges={["Quality Talent", "Fast Hire"]}
              onClick={() => setUserType("client")}
            />
          </div>
        )}

        {userType && (
          <Card className="border-none shadow-sm animate-in fade-in zoom-in-95 duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
              <CardTitle className="text-xl uppercase tracking-tight font-black">
                {userType === "freelancer" ? "Freelancer Account" : "Client Account"}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setUserType("")} className="text-slate-500">
                <ArrowLeft className="mr-2 h-4 w-4" /> Change Role
              </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input id="firstName" className="pl-10" placeholder="Adebayo" value={formData.firstName} onChange={(e) => handleInputChange("firstName", e.target.value)} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input id="lastName" className="pl-10" placeholder="Okafor" value={formData.lastName} onChange={(e) => handleInputChange("lastName", e.target.value)} required />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input id="email" type="email" className="pl-10" placeholder="ade@example.com" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} required />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input id="phone" type="tel" className="pl-10" placeholder="0801..." value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">State</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400 z-10" />
                      <Select onValueChange={(val) => handleInputChange("location", val)}>
                        <SelectTrigger className="pl-10">
                          <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                        <SelectContent>
                          {nigerianStates.map(state => (
                            <SelectItem key={state} value={state}>{state}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input id="password" type="password" className="pl-10" value={formData.password} onChange={(e) => handleInputChange("password", e.target.value)} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input id="confirmPassword" type="password" className="pl-10" value={formData.confirmPassword} onChange={(e) => handleInputChange("confirmPassword", e.target.value)} required />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex items-start space-x-2">
                    <Checkbox id="terms" checked={formData.agreeToTerms} onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked)} required />
                    <Label htmlFor="terms" className="text-xs text-slate-500 cursor-pointer">
                      I agree to the Terms of Service.
                    </Label>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 h-11" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Create My Account"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function SelectionCard({ emoji, title, description, badges, onClick }) {
  return (
    <Card className="cursor-pointer group hover:border-emerald-500 border-2 transition-all shadow-sm" onClick={onClick}>
      <CardContent className="p-8 text-center">
        <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{emoji}</div>
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        <p className="text-sm text-slate-500 mb-6">{description}</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {badges.map(b => <Badge key={b} variant="secondary">{b}</Badge>)}
        </div>
      </CardContent>
    </Card>
  );
}