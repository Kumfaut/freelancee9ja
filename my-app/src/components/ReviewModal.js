import React, { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "./ui/Button";

const ReviewModal = ({ isOpen, freelancerName, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (rating === 0) {
      alert("Please select a star rating");
      return;
    }
    onSubmit({ rating, comment });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-black text-slate-900">Rate Experience</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Project Completion</p>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="text-center">
            <p className="text-slate-600 font-medium mb-4">
              How was your experience working with <span className="text-emerald-600 font-bold">{freelancerName}</span>?
            </p>
            
            {/* Star Rating System */}
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className="transition-transform hover:scale-110 active:scale-95"
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= (hover || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-slate-200"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
              Detailed Feedback (Optional)
            </label>
            <textarea
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 min-h-[100px] resize-none"
              placeholder="Tell others about the quality of work..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <Button 
            onClick={handleSubmit}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-6 rounded-2xl shadow-lg shadow-emerald-100"
          >
            Submit Review & Close Project
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;