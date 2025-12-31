"use client";

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Checkbox } from "../components/ui/Checkbox";
import { Separator } from "../components/ui/Separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/Select";
import { Badge } from "../components/ui/Badge";
import { User, Mail, Phone, MapPin, Lock, ArrowLeft, Chrome, Facebook } from "lucide-react";
import { useAuth } from "../context/AuthContext"; // 1. Import useAuth

export default function SignUpPage() {
  const navigate = useNavigate();
  const { login } = useAuth(); // 2. Grab the login function
  
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
    agreeToTerms: false,
    subscribeNewsletter: false
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (!formData.agreeToTerms) {
      alert("Please agree to the terms and conditions");
      return;
    }

    setIsLoading(true);

    // Simulating API Call
    setTimeout(() => {
      setIsLoading(false);
      
      // 3. Create the user object for the AuthContext
      const newUser = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        role: userType, // 'freelancer' or 'client'
        location: formData.location
      };

      // 4. Log them in (This updates the Navbar and LocalStorage)
      login(newUser);

      console.log("Account Created & Logged In:", newUser);

      // 5. Route based on role
      if (userType === 'client') {
        navigate("/client-dashboard");
      } else {
        navigate("/freelancer-dashboard"); // or "/search"
      }
      
      /* NOTE: If you have a verify-email page, you can still use it, 
      but login(newUser) ensures the Navbar shows the profile right away.
      */
    }, 1500);
  };

  const nigerianStates = [
    "Lagos", "Abuja (FCT)", "Rivers", "Kano", "Oyo", "Enugu", "Kaduna", 
    "Edo", "Delta", "Anambra", "Ogun", "Imo", "Akwa Ibom", "Osun", 
    "Ondo", "Ekiti", "Kwara", "Cross River", "Abia", "Plateau"
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-xl shadow-emerald-100">
              N
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Join NaijaFreelance</h1>
          <p className="text-slate-500 max-w-sm mx-auto">
            The #1 platform for connecting Nigerian talent with global opportunities.
          </p>
        </div>

        {/* Step 1: User Type Selection */}
        {!userType && (
          <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SelectionCard 
              emoji="💼"
              title="Work as a Freelancer"
              description="Find projects, build your portfolio, and earn in Naira or Dollars."
              badges={["Flexible", "Global Reach"]}
              onClick={() => setUserType("freelancer")}
            />
            <SelectionCard 
              emoji="🏢"
              title="Hire Talent"
              description="Post projects and find the best verified Nigerian professionals."
              badges={["Quality Talent", "Fast Hire"]}
              onClick={() => setUserType("client")}
            />
          </div>
        )}

        {/* Step 2: Sign Up Form */}
        {userType && (
          <Card className="border-none shadow-sm animate-in fade-in zoom-in-95 duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
              <div>
                <CardTitle className="text-xl uppercase tracking-tight font-black">
                  {userType === "freelancer" ? "Freelancer Account" : "Client Account"}
                </CardTitle>
                <CardDescription>Enter your details to get started</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setUserType("")} className="text-slate-500 hover:bg-slate-50">
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
                      <Input id="firstName" className="pl-10" placeholder="e.g. Adebayo" value={formData.firstName} onChange={(e) => handleInputChange("firstName", e.target.value)} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input id="lastName" className="pl-10" placeholder="e.g. Okafor" value={formData.lastName} onChange={(e) => handleInputChange("lastName", e.target.value)} required />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input id="email" type="email" className="pl-10" placeholder="adebayo@example.com" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} required />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input id="phone" type="tel" className="pl-10" placeholder="0801 234 5678" value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">State of Residence</Label>
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

                <div className="pt-2 space-y-3">
                  <div className="flex items-start space-x-2">
                    <Checkbox id="terms" checked={formData.agreeToTerms} onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked)} />
                    <Label htmlFor="terms" className="text-xs text-slate-500 leading-normal cursor-pointer">
                      I agree to the <span className="text-emerald-600 font-medium">Terms of Service</span> and <span className="text-emerald-600 font-medium">Privacy Policy</span>.
                    </Label>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 h-11 shadow-lg shadow-emerald-100 font-bold" disabled={isLoading}>
                  {isLoading ? "Creating Account..." : "Create My Account"}
                </Button>

                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center"><Separator /></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400">Or sign up with</span></div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" type="button" className="border-slate-200">
                    <Chrome className="mr-2 h-4 w-4 text-red-500" /> Google
                  </Button>
                  <Button variant="outline" type="button" className="border-slate-200">
                    <Facebook className="mr-2 h-4 w-4 text-blue-600" /> Facebook
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <p className="text-center text-sm text-slate-500">
          Already have an account? <Link to="/login" className="text-emerald-600 font-bold">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

function SelectionCard({ emoji, title, description, badges, onClick }) {
  return (
    <Card 
      className="cursor-pointer group hover:border-emerald-500 border-2 transition-all duration-300 shadow-sm"
      onClick={onClick}
    >
      <CardContent className="p-8 text-center">
        <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{emoji}</div>
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        <p className="text-sm text-slate-500 mb-6">{description}</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {badges.map(b => <Badge key={b} variant="secondary" className="bg-slate-100 text-slate-600 border-none">{b}</Badge>)}
        </div>
      </CardContent>
    </Card>
  );
}