"use client";

import React, { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { Label } from "../components/ui/Label";
import { ArrowLeft, Send, Loader2, Info } from "lucide-react";
import { hireFreelancer } from "../api/api";
import { toast } from "sonner";

export default function CreateOffer() {
  const { freelancerId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Grab the freelancer name and rate passed from the Public Profile
  const { freelancerName, rate } = location.state || { freelancerName: "Freelancer", rate: 0 };

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: rate || 0,
    deadline: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        freelancer_id: freelancerId,
        ...formData,
      };
      
      const response = await hireFreelancer(payload);

      if (response.data.success) {
        toast.success(`Offer sent to ${freelancerName}!`);
        navigate("/my-projects"); // Redirect to projects list
      }
    } catch (error) {
      console.error("Offer Error:", error);
      toast.error(error.response?.data?.message || "Failed to send offer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Cancel
        </Button>

        <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
          <div className="bg-slate-900 p-8 text-white">
            <h1 className="text-2xl font-black">Create a Direct Offer</h1>
            <p className="text-slate-400 mt-1">Sending an invitation to work to <span className="text-emerald-400 font-bold">{freelancerName}</span></p>
          </div>

          <CardContent className="p-8 bg-white">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="font-bold text-slate-700">Project Title</Label>
                <Input 
                  name="title" 
                  placeholder="e.g. Website Redesign for My Business" 
                  required 
                  value={formData.title} 
                  onChange={handleChange}
                  className="rounded-xl border-slate-200 h-12"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-bold text-slate-700">Total Budget (₦)</Label>
                  <Input 
                    name="budget" 
                    type="number" 
                    required 
                    value={formData.budget} 
                    onChange={handleChange}
                    className="rounded-xl border-slate-200 h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold text-slate-700">Deadline</Label>
                  <Input 
                    name="deadline" 
                    type="date" 
                    required 
                    value={formData.deadline} 
                    onChange={handleChange}
                    className="rounded-xl border-slate-200 h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-bold text-slate-700">Project Details</Label>
                <Textarea 
                  name="description" 
                  placeholder="Explain the tasks and deliverables in detail..." 
                  required 
                  value={formData.description} 
                  onChange={handleChange}
                  className="rounded-xl border-slate-200 min-h-[150px]"
                />
              </div>

              <div className="bg-emerald-50 p-4 rounded-2xl flex gap-3 items-start">
                <Info className="text-emerald-600 shrink-0 w-5 h-5" />
                <p className="text-sm text-emerald-800 leading-relaxed">
                  Your funds will be held in <strong>Escrow</strong> once the freelancer accepts the offer. This ensures payment safety for both parties.
                </p>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading} 
                className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg rounded-2xl transition-all gap-2"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                {isLoading ? "Sending..." : "Send Work Offer"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}