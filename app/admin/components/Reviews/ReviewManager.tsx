"use client";

import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, XCircle, Trash2, MessageSquare, Loader2, Send } from 'lucide-react';

interface ReviewItem {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
  status: string;
  adminReply: string | null;
  productName: string;
  productId: string;
  createdAt: string;
}

export default function ReviewManager() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/reviews?t=' + Date.now());
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    setUpdatingId(id);
    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
      }
    } catch {
      alert('Failed to update review status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSendReply = async (id: string) => {
    const reply = replyTextMap[id];
    if (!reply || !reply.trim()) return;

    setUpdatingId(id);
    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, adminReply: reply.trim(), status: 'approved' }),
      });
      if (res.ok) {
        setReviews((prev) =>
          prev.map((r) => (r.id === id ? { ...r, adminReply: reply.trim(), status: 'approved' } : r))
        );
        setReplyTextMap((prev) => ({ ...prev, [id]: '' }));
      }
    } catch {
      alert('Failed to save store reply.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this customer review?')) return;
    try {
      const res = await fetch(`/api/admin/reviews?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
      }
    } catch {
      alert('Failed to delete review.');
    }
  };

  const pendingReviews = reviews.filter((r) => r.status === 'pending');

  return (
    <div className="space-y-6">
      <div className="bg-[#18110b] border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-orange-400" />
            Customer Feedback Moderation
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Publish verified buyer reviews, archive spam, and provide official ZiaTech technical responses.
          </p>
        </div>

        {pendingReviews.length > 0 && (
          <span className="px-3 py-1 bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold text-xs rounded-full animate-pulse">
            {pendingReviews.length} Awaiting Approval
          </span>
        )}
      </div>

      {reviews.length === 0 ? (
        <div className="bg-[#18110b] border border-slate-800 rounded-3xl p-16 text-center text-slate-500">
          <p className="text-sm">No customer reviews submitted yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => {
            const dateStr = new Date(rev.createdAt).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            });

            return (
              <div
                key={rev.id}
                className="bg-[#18110b]/90 border border-slate-800/80 hover:border-orange-500/30 rounded-3xl p-5 md:p-6 backdrop-blur-xl transition shadow-lg space-y-4"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-bold text-white text-sm">{rev.reviewerName}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-xs text-orange-400 font-medium">
                        Regarding: {rev.productName || 'Hardware Component'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] font-mono text-slate-500">{dateStr}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        rev.status === 'approved'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : rev.status === 'rejected'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/10 text-amber-300 border border-amber-500/30 animate-pulse'
                      }`}
                    >
                      {rev.status}
                    </span>

                    {rev.status !== 'approved' && (
                      <button
                        onClick={() => handleUpdateStatus(rev.id, 'approved')}
                        disabled={updatingId === rev.id}
                        className="p-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-xl transition"
                        title="Approve & publish"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}

                    {rev.status !== 'rejected' && (
                      <button
                        onClick={() => handleUpdateStatus(rev.id, 'rejected')}
                        disabled={updatingId === rev.id}
                        className="p-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 rounded-xl transition"
                        title="Reject review"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(rev.id)}
                      className="p-1.5 bg-slate-900 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 border border-slate-800 rounded-xl transition"
                      title="Delete review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {rev.comment && (
                  <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/40 p-3.5 rounded-2xl border border-slate-800/60 italic">
                    "{rev.comment}"
                  </p>
                )}

                {/* Admin Reply */}
                {rev.adminReply ? (
                  <div className="bg-orange-950/20 border border-cyan-900/40 rounded-2xl p-3.5 text-xs text-orange-200">
                    <span className="font-bold text-orange-400 uppercase text-[10px] tracking-wider block mb-1">
                      Official ZiaTech Response:
                    </span>
                    <p>{rev.adminReply}</p>
                  </div>
                ) : (
                  <div className="flex gap-2 items-center pt-2">
                    <input
                      type="text"
                      placeholder="Write technical response..."
                      value={replyTextMap[rev.id] || ''}
                      onChange={(e) =>
                        setReplyTextMap((prev) => ({ ...prev, [rev.id]: e.target.value }))
                      }
                      className="flex-1 h-9 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-orange-400 focus:outline-none"
                    />
                    <button
                      onClick={() => handleSendReply(rev.id)}
                      disabled={updatingId === rev.id || !replyTextMap[rev.id]}
                      className="px-4 h-9 bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition disabled:opacity-40"
                    >
                      <Send className="w-3.5 h-3.5" /> Reply
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
