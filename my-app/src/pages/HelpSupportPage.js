import React, { useState } from "react";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Textarea } from "../components/ui/Textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/Tabs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../components/ui/Accordion";
import { Badge } from "../components/ui/Badge";
import { 
  HelpCircle, MessageCircle, Mail, Phone, Search, Book, Users, 
  Shield, CreditCard, Briefcase, FileText, Send, CheckCircle2 
} from "lucide-react";
// Remove or keep sonner toast based on your setup
// import { toast } from "sonner"; 

export default function HelpSupportPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const faqCategories = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: Book,
      faqs: [
        {
          question: "How do I create an account on NaijaFreelance?",
          answer: "Click on the 'Sign Up' button at the top right corner, choose whether you want to work as a freelancer or hire talent, fill in your details, and verify your email address. It's free to sign up!"
        },
        {
          question: "What's the difference between freelancer and client accounts?",
          answer: "Freelancer accounts are for people offering services and looking for work. Client accounts are for businesses or individuals looking to hire freelancers. You can switch between roles if needed."
        }
      ]
    },
    {
      id: "payments",
      title: "Payments & Earnings",
      icon: CreditCard,
      faqs: [
        {
          question: "How do payments work on NaijaFreelance?",
          answer: "We use a secure escrow system. When a client hires you, they deposit funds in escrow. Once you complete the work and the client approves it, the funds are released to your wallet. You can then withdraw to your Nigerian bank account."
        },
        {
          question: "What payment methods are supported?",
          answer: "We support Nigerian bank transfers, PayStack, and Flutterwave. All transactions are in Naira (₦) for your convenience."
        }
      ]
    }
    // ... Add other categories as needed
  ];

  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => 
      searchQuery === "" || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">How can we help you?</h1>
          <p className="text-lg text-slate-600 mb-8">Search our knowledge base or browse frequently asked questions.</p>
          
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search for help articles, guides, and FAQs..."
              className="pl-12 py-6 text-lg shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-6">
          {filteredFAQs.length === 0 ? (
            <Card className="text-center py-12">
              <HelpCircle className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <h3 className="text-lg font-medium">No results found</h3>
              <Button variant="ghost" onClick={() => setSearchQuery("")}>Clear Search</Button>
            </Card>
          ) : (
            filteredFAQs.map(category => {
              const Icon = category.icon;
              return (
                <Card key={category.id} className="overflow-hidden">
                  <CardHeader className="bg-slate-50 border-b">
                    <CardTitle className="flex items-center gap-2 text-emerald-700">
                      <Icon className="w-5 h-5" /> {category.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Accordion type="single" collapsible className="w-full">
                      {category.faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`} className="px-6 border-b last:border-0">
                          <AccordionTrigger className="hover:no-underline py-4 text-left">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-slate-600 pb-4">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}