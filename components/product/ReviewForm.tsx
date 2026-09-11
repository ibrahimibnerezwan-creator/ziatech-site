"use client";

import { useState } from "react";
import { Star, Send, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface ReviewFormProps {
  productId: string;
}

export function ReviewForm({ productId }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewerName, setReviewerName] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !comment.trim()) {
      toast.error("দয়া করে আপনার নাম ও মন্তব্য লিখুন");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          rating,
          reviewerName: reviewerName.trim(),
          comment: comment.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to submit review");
      }

      setSubmitted(true);
      toast.success("আপনার রিভিউ জমা দেওয়া হয়েছে!");
    } catch (err: any) {
      toast.error(err.message || "রিভিউ জমা দিতে ব্যর্থ হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white/[0.02] border border-emerald-500/20 rounded-2xl p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto mb-3">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h4 className="text-white font-bold text-base mb-1">ধন্যবাদ আপনার মতামতের জন্য!</h4>
        <p className="text-xs text-gray-400 max-w-sm mx-auto">
          আপনার রিভিউটি জমা হয়েছে। আমাদের এডমিন পর্যালোচনা করার পর এটি ওয়েবসাইটে প্রদর্শিত হবে।
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 space-y-4"
    >
      <h3 className="text-base font-bold text-white">আপনার মতামত দিন (Write a Review)</h3>

      {/* Star Selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400">রেটিং:</span>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 text-gray-600 hover:text-amber-400 transition-colors"
            >
              <Star
                className={`w-5 h-5 ${
                  star <= (hoverRating || rating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-gray-600"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">
            আপনার নাম *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. তানভীর আহমেদ"
            value={reviewerName}
            onChange={(e) => setReviewerName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-300 mb-1">
          আপনার অভিজ্ঞতা / রিভিউ *
        </label>
        <textarea
          required
          rows={3}
          placeholder="পণ্যটি কেমন কাজ করছে, কোয়ালিটি কেমন লেগেছে ইত্যাদি শেয়ার করুন..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="py-2.5 px-5 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-400 font-semibold text-xs transition-colors flex items-center gap-2 disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            জমা হচ্ছে...
          </>
        ) : (
          <>
            <Send className="w-3.5 h-3.5" />
            রিভিউ সাবমিট করুন
          </>
        )}
      </button>
    </form>
  );
}
