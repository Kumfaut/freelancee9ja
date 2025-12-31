import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { 
  Shield, Database,ArrowLeft, CheckCircle, Download,
} from "lucide-react";

export default function PrivacyPolicyPage() {
  const navigate = useNavigate();
  const lastUpdated = "December 29, 2024";

  const sections = [
    { id: "introduction", title: "1. Introduction", icon: Shield, content: `NaijaFreelance is committed to protecting your privacy...` },
    { id: "information", title: "2. Information We Collect", icon: Database, content: `Personal Info: Name, email, phone, Location (Nigeria)...` },
    // ... add other sections from your guide as needed
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-emerald-600 rounded-xl flex items-center justify-center text-white">
              <Shield className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
          <div className="flex items-center justify-center gap-2">
            <p className="text-sm text-slate-500">Last Updated: {lastUpdated}</p>
            <Badge className="bg-emerald-100 text-emerald-700">NDPR Compliant</Badge>
          </div>
        </div>

        <Card className="border-emerald-200 bg-emerald-50">
          <CardHeader>
            <CardTitle className="text-emerald-900 text-lg">Privacy at a Glance</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-medium">We Don't Sell Your Data</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-medium">NDPR Compliant</span>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Go Back
          </Button>
          <Button onClick={() => window.print()} className="bg-emerald-600 gap-2">
            <Download className="w-4 h-4" /> Save as PDF
          </Button>
        </div>
      </div>
    </div>
  );
}