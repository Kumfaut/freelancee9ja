import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Textarea } from "../components/ui/Textarea";
import { MessageCircle, Mail, Phone, Send, CheckCircle2, Loader2 } from "lucide-react";
import { Badge } from "../components/ui/Badge";

export default function ContactUsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "general",
    message: ""
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate an API call to your backend
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Form Data Submitted:", formData);
      setIsSuccess(true);
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <Card className="max-w-md w-full text-center p-8">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Message Sent!</h2>
          <p className="text-slate-600 mt-2 mb-6">
            Thanks for reaching out, {formData.name.split(' ')[0]}. Our Naija Support team will review your message and get back to you at {formData.email} within 24 hours.
          </p>
          <Button 
            onClick={() => setIsSuccess(false)} 
            variant="outline" 
            className="w-full"
          >
            Send another message
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-emerald-100 text-emerald-700">Support Center</Badge>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">How can we help you today?</h1>
          <p className="text-slate-600 mt-3 text-lg">Expect a response from our Lagos office within 24 hours.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Side: Contact Info */}
          <div className="space-y-4">
            <Card className="border-none shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="bg-blue-50 p-3 rounded-lg text-blue-600"><Mail /></div>
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">Email us</p>
                  <p className="text-sm font-medium">support@naijafreelance.ng</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="bg-emerald-50 p-3 rounded-lg text-emerald-600"><Phone /></div>
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">Call Support</p>
                  <p className="text-sm font-medium">+234 800 NAIJA FIX</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="bg-purple-50 p-3 rounded-lg text-purple-600"><MessageCircle /></div>
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">WhatsApp</p>
                  <p className="text-sm font-medium">Available 9am - 5pm</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side: Form */}
          <Card className="lg:col-span-2 shadow-md">
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>Include your ticket number if this is regarding an existing dispute.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="e.g. Chinelo Okoro" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="chinelo@example.com" value={formData.email} onChange={handleChange} required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">What is this about?</Label>
                  <select 
                    id="category" 
                    className="w-full flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="general">General Inquiry</option>
                    <option value="payment">Payment & Wallet Issues</option>
                    <option value="dispute">Job Dispute</option>
                    <option value="verification">ID Verification</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="Briefly describe the issue" value={formData.subject} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Provide as much detail as possible..." 
                    className="min-h-37.5" 
                    value={formData.message}
                    onChange={handleChange}
                    required 
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 h-11 text-lg transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}