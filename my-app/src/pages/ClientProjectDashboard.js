"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Avatar, AvatarFallback } from "../components/ui/Avatar";
import { 
  ShieldCheck, 
  Users, 
  Clock, 
  RotateCcw,
  CheckCircle2
} from "lucide-react";
import { useParams, Navigate } from "react-router-dom"; // Add useParams
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export default function ClientProjectDashboard({ defaultTab = "proposals" }) {
  const { projectId } = useParams(); // This grabs "NF-9920" from the URL
  const { user, isLoggedIn } = useAuth();
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  // Modal States
  const [showReleaseModal, setShowReleaseModal] = useState(false);
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  
  // Loading/Text States
  const [isReleasing, setIsReleasing] = useState(false);
  const [revisionText, setRevisionText] = useState("");

  if (!isLoggedIn) return <Navigate to="/login" />;
  if (user.role !== "client") return <Navigate to="/freelancer-dashboard" />;

  const project = {
    id: projectId || "NF-9920", // Fallback if no ID is found
    title: projectId === "NF-8841" ? "Logo Design for Logistics Co" : "Build a Fintech Mobile App",
    budget: projectId === "NF-8841" ? "₦50,000" : "₦1,200,000",
    status: "open",
    applicants: [
      { id: 1, name: "Adebayo O.", role: "Fullstack Dev", rating: 4.9, bid: "₦1,150,000", avatar: "AO" },
      { id: 2, name: "Chidi E.", role: "UI/UX Designer", rating: 4.7, bid: "₦1,200,000", avatar: "CE" }
    ]
  };
  const handleFundEscrow = (freelancerName) => {
    toast.info(`Redirecting to Paystack for ${freelancerName}...`, {
      description: "Securing project funds in NaijaTrust Escrow."
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">{project.title}</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Project ID: #NF-9920</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="text-xs font-bold border-slate-200">Edit Post</Button>
          <Button className="bg-red-50 text-red-600 hover:bg-red-100 border-none text-xs font-bold">Close Project</Button>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        <TabButton 
          active={activeTab === "proposals"} 
          onClick={() => setActiveTab("proposals")}
          icon={<Users className="w-4 h-4" />}
          label="Proposals"
        />
        <TabButton 
          active={activeTab === "milestones"} 
          onClick={() => setActiveTab("milestones")}
          icon={<Clock className="w-4 h-4" />}
          label="Management"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {activeTab === "proposals" ? (
            <div className="space-y-4">
              {project.applicants.map((dev) => (
                <Card key={dev.id} className="border-none shadow-sm hover:shadow-md transition-all">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-4">
                        <Avatar className="h-12 w-12 border border-slate-100">
                          <AvatarFallback className="bg-slate-100 text-slate-600 font-bold">{dev.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-bold text-slate-900">{dev.name}</h4>
                          <p className="text-xs text-slate-500">{dev.role}</p>
                        </div>
                      </div>
                      <div className="text-right font-black text-slate-900">{dev.bid}</div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 font-bold text-xs" onClick={() => handleFundEscrow(dev.name)}>
                        Accept & Fund
                      </Button>
                      <Button variant="outline" className="text-xs font-bold border-slate-200">Message</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            /* Management / Milestones Tab Content */
            <div className="space-y-4">
              <Card className="border-none shadow-sm border-l-4 border-l-blue-500">
                <CardContent className="p-5 flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-blue-50 text-blue-600 border-none text-[10px] font-bold">WORK SUBMITTED</Badge>
                    </div>
                    <h4 className="font-bold text-slate-900">UI Design & Prototyping</h4>
                    <p className="text-xs text-slate-500 font-medium tracking-tight">₦200,000 Securing in Escrow</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      className="text-xs font-bold h-9 border-slate-200"
                      onClick={() => {
                        setSelectedMilestone({ title: "UI Design & Prototyping", amount: 200000 });
                        setShowRevisionModal(true);
                      }}
                    >
                      <RotateCcw className="w-3 h-3 mr-1" /> Revision
                    </Button>
                    <Button 
                      className="bg-emerald-600 hover:bg-emerald-700 text-xs font-bold h-9 shadow-md shadow-emerald-100"
                      onClick={() => {
                        setSelectedMilestone({ title: "UI Design & Prototyping", amount: 200000 });
                        setShowReleaseModal(true);
                      }}
                    >
                      Approve & Release
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Sidebar Summary */}
        <div className="space-y-4">
          <Card className="border-none bg-slate-900 text-white shadow-xl">
            <CardHeader><CardTitle className="text-sm flex items-center gap-2 font-bold"><ShieldCheck className="w-4 h-4 text-emerald-400"/>Escrow Protection</CardTitle></CardHeader>
            <CardContent>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">Funds are only released when you click "Approve Work". This ensures your project is completed correctly.</p>
              <div className="pt-4 border-t border-slate-800 flex justify-between font-bold">
                <span className="text-xs text-slate-400 uppercase tracking-tighter">Total Budget</span>
                <span className="text-emerald-400 text-lg">{project.budget}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* RELEASE FUNDS MODAL */}
      {showReleaseModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-100 p-4">
          <Card className="max-w-md w-full border-none shadow-2xl animate-in zoom-in-95 duration-200">
            <CardHeader className="text-center pb-2">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <CardTitle className="text-xl font-black text-slate-900">Confirm Payment?</CardTitle>
              <p className="text-sm text-slate-500 mt-2 px-4">
                Confirming will immediately move <strong>₦{selectedMilestone?.amount.toLocaleString()}</strong> to the freelancer's wallet.
              </p>
            </CardHeader>

            <CardContent className="space-y-6 pt-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex justify-between items-center mb-1 text-xs font-bold text-slate-400 uppercase">
                  <span>Milestone</span>
                  <span>Amount</span>
                </div>
                <div className="flex justify-between items-center text-slate-900 font-bold">
                  <span className="text-sm">{selectedMilestone?.title}</span>
                  <span className="text-lg tracking-tighter">₦{selectedMilestone?.amount.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 h-12 font-bold text-slate-600" onClick={() => setShowReleaseModal(false)} disabled={isReleasing}>Cancel</Button>
                <Button 
                  className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 font-bold"
                  onClick={() => {
                    setIsReleasing(true);
                    setTimeout(() => {
                      setIsReleasing(false);
                      setShowReleaseModal(false);
                      toast.success("Payment released successfully!");
                    }, 2000);
                  }}
                >
                  {isReleasing ? "Processing..." : "Yes, Release Funds"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* REVISION MODAL */}
      {showRevisionModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-100 p-4">
          <Card className="max-w-md w-full border-none shadow-2xl animate-in slide-in-from-bottom-4">
            <CardHeader>
              <CardTitle className="text-xl font-black text-slate-900">Request Revision</CardTitle>
              <p className="text-sm text-slate-500">Provide feedback on what needs to be fixed before payment.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <textarea 
                className="w-full min-h-30 p-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm"
                placeholder="e.g. Please update the color scheme on the dashboard..."
                value={revisionText}
                onChange={(e) => setRevisionText(e.target.value)}
              />
              <div className="flex gap-3">
                <Button variant="ghost" className="flex-1 font-bold text-slate-500" onClick={() => setShowRevisionModal(false)}>Cancel</Button>
                <Button 
                  className="flex-1 bg-slate-900 text-white font-bold"
                  disabled={!revisionText.trim()}
                  onClick={() => {
                    toast.info("Revision request sent");
                    setShowRevisionModal(false);
                    setRevisionText("");
                  }}
                >
                  Send Request
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// Helper Component for Tabs
function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
        active ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
      }`}
    >
      {icon} {label}
    </button>
  );
}