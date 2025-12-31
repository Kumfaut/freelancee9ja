import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Alert, AlertDescription } from "../components/ui/Alert";
import { Scale,  AlertTriangle, ArrowLeft, Download } from "lucide-react";

export default function TermsOfServicePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-emerald-600 rounded-xl flex items-center justify-center text-white">
              <Scale className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Terms of Service</h1>
          <p className="text-slate-500">Please read these terms carefully before using NaijaFreelance</p>
        </div>

        <Alert className="border-emerald-200 bg-emerald-50">
          <AlertTriangle className="h-4 w-4 text-emerald-600" />
          <AlertDescription className="text-emerald-800">
            <strong>Legal Agreement:</strong> By using this platform, you agree to these binding terms.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>1. Acceptance of Terms</CardTitle>
          </CardHeader>
          <CardContent className="text-slate-700 leading-relaxed">
            By accessing NaijaFreelance, you agree to comply with Nigerian labor laws and our 10% commission structure for freelancers...
          </CardContent>
        </Card>

        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Button>
          <Button className="bg-emerald-600" onClick={() => window.print()}>
            <Download className="w-4 h-4" /> Download PDF
          </Button>
        </div>
      </div>
    </div>
  );
}