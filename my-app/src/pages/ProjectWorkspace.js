import React from "react";
import { Navbar } from "../components/Header";
import MilestoneTracker from "../components/MilestoneTracker"; // Import your block

export default function ProjectWorkspace() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Side: Chat/Messages (We'll put this here later) */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm p-6 min-h-[500px]">
            <h2 className="text-xl font-bold text-slate-900 border-b pb-4 mb-4">Project Discussion</h2>
            <p className="text-slate-500 text-sm">Your chat interface will go here...</p>
          </div>

          {/* Right Side: The Milestone Tracker */}
          <div className="w-full lg:w-[400px]">
            <MilestoneTracker totalBudget={800000} />
          </div>

        </div>
      </main>
    </div>
  );
}