import React from "react";
import { Card, CardContent } from "./ui/Card";

const cities = ["Lagos", "Abuja", "Port Harcourt", "Kano", "Ibadan", "Enugu"];

export default function NigerianCities() {
  return (
    <section className="bg-slate-900 text-white px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-emerald-600 text-white border-0">
          <CardContent className="p-6">
            <h3 className="text-center mb-4 font-semibold text-lg">Serving Freelancers Across Nigeria</h3>
            <div className="flex justify-center flex-wrap gap-4 text-sm">
              {cities.map((city, index) => (
                <span key={index}>{city}</span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
