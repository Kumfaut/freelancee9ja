"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Star  } from "lucide-react";
import { Button } from "./ui/Button";

const ReviewModal = ({ isOpen, freelancerName, onSubmit }) => {
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (rating === 0) {
      alert(t('review_error_star'));
      return;
    }
    onSubmit({ rating, comment });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="bg-slate-50/50 p-8 border-b border-slate-100 relative">
          <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
            {t('review_header')}
          </h3>
          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mt-1">
            {t('review_subtitle')}
          </p>
        </div>

        <div className="p-10 space-y-8">
          <div className="text-center">
            <p className="text-slate-500 font-bold leading-relaxed mb-6">
              {t('review_question')} <br/>
              <span className="text-slate-900 text-xl font-black">{freelancerName}</span>
            </p>
            
            {/* Star Rating System */}
            <div className="flex justify-center gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className="transition-all transform hover:scale-125 active:scale-90"
                >
                  <Star
                    className={`w-12 h-12 transition-colors ${
                      star <= (hover || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-slate-100 fill-slate-100"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-2">
              {t('review_feedback_label')}
            </label>
            <textarea
              className="w-full bg-slate-50 border-none ring-1 ring-slate-200 rounded-[1.5rem] p-5 text-sm font-medium focus:ring-2 focus:ring-emerald-500 transition-all min-h-[120px] resize-none"
              placeholder={t('review_placeholder')}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <Button 
            onClick={handleSubmit}
            className="w-full bg-slate-900 hover:bg-emerald-600 h-16 rounded-2xl text-white font-black uppercase text-[10px] tracking-[0.2em] shadow-xl transition-all"
          >
            {t('review_submit_btn')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;