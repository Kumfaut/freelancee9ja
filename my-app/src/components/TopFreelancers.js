import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Card, CardContent } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";

export default function TopFreelancers() {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopFreelancers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users/freelancers/top");
        // Handling both response formats
        const data = response.data.success ? response.data.data : response.data;
        setFreelancers(data || []);
      } catch (error) {
        console.error("Error fetching freelancers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopFreelancers();
  }, []);

  const getInitials = (name) => {
    return name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "??";
  };

  

  if (loading) return <div className="py-16 text-center">Loading freelancers...</div>;

  return (
    <section className="px-4 py-16 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-center mb-8">Top Nigerian Freelancers</h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {freelancers.map((freelancer) => (
            <Card key={freelancer.id}>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {/* Initials/Avatar Circle */}
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-semibold mr-4 overflow-hidden">
                    {freelancer.profile_image ? (
                      <img src={freelancer.profile_image} alt={freelancer.full_name} className="object-cover w-full h-full" />
                    ) : (
                      getInitials(freelancer.full_name)
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{freelancer.full_name}</h3>
                    <p className="text-sm text-muted-foreground">{freelancer.title || "Freelancer"}</p>
                    <p className="text-sm text-muted-foreground">⭐ 5.0 (New)</p>
                  </div>
                </div>
                
                {/* Skills Section */}
                <div className="flex gap-2 mb-4">
                  {(freelancer.bio?.split(",").slice(0, 3) || ["Expert"]).map((skill, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {skill.trim()}
                    </Badge>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-emerald-600 font-semibold">
                      ₦{Number(freelancer.hourlyRate || 0).toLocaleString()}
                    </span>
                    <span className="text-muted-foreground text-sm">/hour</span>
                  </div>
                  <Link to={`/profile/${freelancer.id || freelancer.user_id}`}>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                      Contact
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/browse-freelancers">
            <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
              Browse All Freelancers
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}