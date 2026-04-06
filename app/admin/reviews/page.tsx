import { getAllReviews } from '@/lib/data'
import { format } from 'date-fns'
import { MessageSquare, Star, CheckCircle, XCircle } from 'lucide-react'
import ReviewActionButtons from './review-action-buttons'
import ReplyForm from './reply-form'

export default async function ReviewsPage() {
    const reviews = await getAllReviews()

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white">Guest Feedback</h1>
                    <p className="text-text-secondary italic">"Excellence refined through direct critique."</p>
                </div>
            </div>

            <div className="bg-bg-elevated/60 border border-primary-500/10 rounded-2xl overflow-hidden backdrop-blur-md">
                {reviews.length === 0 ? (
                    <div className="p-16 text-center flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-primary-500/5 flex items-center justify-center mb-6 border border-primary-500/10">
                            <MessageSquare className="w-8 h-8 text-primary-500/30" />
                        </div>
                        <h3 className="text-xl font-display font-bold text-white mb-2">Silent Chambers</h3>
                        <p className="text-text-muted max-w-sm">No transmissions received yet. Customer insights will materialize here once products reach their destination.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-primary-500/10">
                        {reviews.map((review) => (
                            <div key={review.id} className="p-8 hover:bg-primary-500/5 transition-all duration-300 group">
                                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <div className="w-10 h-10 rounded-full bg-bg-void border border-primary-500/20 flex items-center justify-center text-primary-400 font-display font-bold text-sm shadow-sm group-hover:border-primary-500/40 transition-colors">
                                                {review.reviewerName.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-display font-bold text-white leading-none mb-1">{review.reviewerName}</div>
                                                <div className="text-[10px] uppercase tracking-widest text-text-muted font-medium">
                                                    {format(new Date(review.createdAt), 'MMMM dd, yyyy')}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-sm font-bold text-primary-400/80 mb-3 ml-[52px]">
                                            Regarding: <span className="text-white decoration-primary-500/30 underline underline-offset-4">{review.productName || 'Classified Gear'}</span>
                                        </div>
                                        <div className="flex items-center mb-4 ml-[52px] space-x-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'text-primary-400 fill-primary-400 shadow-[0_0_8px_rgba(251,191,36,0.3)]' : 'text-bg-void fill-bg-void border border-white/5'}`} />
                                            ))}
                                        </div>
                                        
                                        <div className="relative ml-[52px]">
                                            <div className="absolute -left-4 top-0 bottom-0 w-[2px] bg-primary-500/20 rounded-full group-hover:bg-primary-500/40 transition-colors" />
                                            <p className="text-text-secondary italic text-lg leading-relaxed antialiased">
                                                "{review.comment}"
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col items-end space-y-4 shrink-0">
                                        <div className="flex items-center">
                                            {review.status === 'approved' && (
                                                <span className="flex items-center text-[10px] uppercase tracking-widest font-bold text-primary-400 bg-primary-500/5 border border-primary-500/20 px-3 py-1 rounded-full shadow-sm">
                                                    <CheckCircle className="w-3 h-3 mr-1.5" /> Published
                                                </span>
                                            )}
                                            {review.status === 'rejected' && (
                                                <span className="flex items-center text-[10px] uppercase tracking-widest font-bold text-accent-400 bg-accent-500/5 border border-accent-500/20 px-3 py-1 rounded-full shadow-sm">
                                                    <XCircle className="w-3 h-3 mr-1.5" /> Archived
                                                </span>
                                            )}
                                            {review.status === 'pending' && (
                                                <span className="flex items-center text-[10px] uppercase tracking-widest font-bold text-platinum-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full shadow-sm">
                                                    <Star className="w-3 h-3 mr-1.5 animate-pulse" /> Awaiting Intel
                                                </span>
                                            )}
                                        </div>
                                        
                                        <ReviewActionButtons reviewId={review.id} currentStatus={review.status as any} />
                                    </div>
                                </div>
                                
                                <div className="mt-8 ml-[52px]">
                                    {review.adminReply ? (
                                        <div className="bg-bg-void/50 border border-primary-500/10 p-5 rounded-2xl shadow-inner relative overflow-hidden group/reply">
                                            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover/reply:opacity-30 transition-opacity">
                                                <MessageSquare className="w-8 h-8 text-primary-500" />
                                            </div>
                                            <p className="text-[10px] uppercase tracking-widest font-bold text-primary-500 mb-2">ZiaTech Official Response</p>
                                            <p className="text-text-secondary text-sm leading-relaxed border-l-2 border-primary-500/30 pl-4">{review.adminReply}</p>
                                        </div>
                                    ) : (
                                        <div className="mt-4 pt-4 border-t border-primary-500/5">
                                            <ReplyForm reviewId={review.id} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
