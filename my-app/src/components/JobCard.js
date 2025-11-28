import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { MapPin, Clock, Users, Star, Briefcase, Calendar, Bookmark } from "lucide-react";

export default function JobCard({ job, formatBudget, toggleSkill }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg">{job.title}</CardTitle>
              {job.featured && (
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                  Featured
                </Badge>
              )}
              {job.urgent && <Badge variant="destructive" className="text-xs">Urgent</Badge>}
              {job.verified && <span className="text-emerald-600" title="Verified Client">✓</span>}
            </div>
            <div className="flex items-center gap-4 mb-2">
              <div className="text-emerald-600 font-semibold">{formatBudget(job)}</div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                {job.clientRating.toFixed(1)}
              </div>
            </div>
          </div>
          <Button variant="outline" className="ml-4">
            <Bookmark className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
        <CardDescription className="text-base leading-relaxed">{job.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {job.skills.slice(0, 5).map((skill, index) => (
            <Badge key={index} variant="secondary">{skill}</Badge>
          ))}
          {job.skills.length > 5 && <Badge variant="outline">+{job.skills.length - 5} more</Badge>}
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1"><MapPin className="w-4 h-4" />{job.location}, {job.state}</div>
          <div className="flex items-center gap-1"><Clock className="w-4 h-4" />{job.timePosted}</div>
          <div className="flex items-center gap-1"><Briefcase className="w-4 h-4" />{job.experienceLevel}</div>
          <div className="flex items-center gap-1"><Calendar className="w-4 h-4" />{job.duration}</div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1"><Users className="w-4 h-4 text-muted-foreground" /><span className="text-sm text-muted-foreground">{job.proposals} proposals</span></div>
          <Button className="bg-emerald-600 hover:bg-emerald-700">Submit Proposal</Button>
        </div>
      </CardContent>
    </Card>
  );
}
