"use client";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Checkbox } from "../components/ui/Checkbox";
import { Separator } from "../components/ui/Separator";
import { Mail, Lock, Chrome, Facebook, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext"; 
import { loginUser as apiLoginUser } from "../api/api"; // Import the actual API call

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth(); 
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(""); 
    
    try {
      const response = await apiLoginUser({ email, password });
      
      // DEBUG: Look at your browser console to see if 'email' is here
      console.log("Login Response Data:", response.data);

      const { token, user } = response.data;

      if (!token || !user?.email) {
        console.error("Login successful but user data is incomplete:", user);
      }

      // Save token (though your login function already does this, it's good for safety)
      localStorage.setItem("token", token);

      login(user, token);

      // Redirect
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "client") {
        navigate("/client-dashboard");
      } else {
        navigate("/freelancer-dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        
        <div className="text-center">
          <Link to="/" className="inline-flex justify-center mb-6">
            <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-emerald-100">
              N
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome back</h1>
          <p className="text-slate-500">Sign in to your NaijaFreelance account</p>
        </div>

        <Card className="border-none shadow-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Sign In</CardTitle>
            <CardDescription>Enter your email and password to continue</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Show Error Message if login fails */}
            {error && (
              <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 focus-visible:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" size="sm" className="text-xs text-emerald-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 focus-visible:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked)}
                />
                <Label htmlFor="remember" className="text-sm font-normal text-slate-600 cursor-pointer">
                  Remember me for 30 days
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 h-11 mt-2 font-bold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-slate-400">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => handleSocialLogin("google")}
                  className="border-slate-200 hover:bg-slate-50"
                >
                  <Chrome className="mr-2 h-4 w-4 text-red-500" />
                  Google
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => handleSocialLogin("facebook")}
                  className="border-slate-200 hover:bg-slate-50"
                >
                  <Facebook className="mr-2 h-4 w-4 text-blue-600" />
                  Facebook
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link to="/signup" className="text-emerald-600 font-bold hover:underline">
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
}