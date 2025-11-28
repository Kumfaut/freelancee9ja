import React from "react";
import { Card, CardContent } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";

const freelancers = [
  {
    initials: "AO",
    name: "Adebayo Okafor",
    role: "Full Stack Developer",
    rating: "⭐ 4.9 (127 reviews)",
    skills: ["React", "Node.js", "AWS"],
    rate: "₦3,500",
  },
  {
    initials: "FA",
    name: "Fatima Aliyu",
    role: "UI/UX Designer",
    rating: "⭐ 5.0 (94 reviews)",
    skills: ["Figma", "Adobe XD"],
    rate: "₦2,800",
  },
];

export default function TopFreelancers() {
  return (
    <section className="px-4 py-16 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-center mb-8">Top Nigerian Freelancers</h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {freelancers.map((freelancer, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-semibold mr-4">
                    {freelancer.initials}
                  </div>
                  <div>
                    <h3 className="font-medium">{freelancer.name}</h3>
                    <p className="text-sm text-muted-foreground">{freelancer.role}</p>
                    <p className="text-sm text-muted-foreground">{freelancer.rating}</p>
                  </div>
                </div>
                <div className="flex gap-2 mb-4">
                  {freelancer.skills.map((skill, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">{skill}</Badge>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-emerald-600 font-semibold">{freelancer.rate}</span>
                    <span className="text-muted-foreground text-sm">/hour</span>
                  </div>
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">Contact</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-8">
          <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
            Browse All Freelancers
          </Button>
        </div>
      </div>
    </section>
  );
}
