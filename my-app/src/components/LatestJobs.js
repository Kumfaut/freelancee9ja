import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";

const jobs = [
  {
    title: "E-commerce Website Development",
    description: "Looking for an experienced developer to build a modern e-commerce platform with payment integration.",
    price: "₦150,000 - ₦300,000",
    skills: ["React", "Node.js", "MongoDB"],
    location: "Lagos, Nigeria",
    time: "2 hours ago",
    proposals: 8,
  },
  {
    title: "Brand Logo Design",
    description: "Creative logo design needed for a fintech startup. Looking for modern, professional designs.",
    price: "₦25,000 - ₦50,000",
    skills: ["Adobe Illustrator", "Photoshop"],
    location: "Abuja, Nigeria",
    time: "5 hours ago",
    proposals: 15,
  },
];

export default function LatestJobs() {
  return (
    <section className="px-4 py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-8">Latest Job Posts</h2>
        <div className="grid gap-6 max-w-2xl mx-auto">
          {jobs.map((job, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{job.title}</CardTitle>
                <CardDescription>{job.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-emerald-600 font-semibold mb-3">{job.price}</div>
                <div className="flex gap-2 mb-3">
                  {job.skills.map((skill, i) => (
                    <Badge key={i} variant="secondary">{skill}</Badge>
                  ))}
                </div>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>📍 {job.location} • 🕒 {job.time}</span>
                  <span>{job.proposals} proposals</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-8">
          <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
            View All Jobs
          </Button>
        </div>
      </div>
    </section>
  );
}
