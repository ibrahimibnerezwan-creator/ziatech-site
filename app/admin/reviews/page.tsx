import { getAllReviews } from '@/lib/data'
import { format } from 'date-fns'
import { MessageSquare, Star, CheckCircle, XCircle } from 'lucide-react'
import ReviewActionButtons from './review-action-buttons'
import ReplyForm from './reply-form'

export default async function ReviewsPage() {
    const reviews = await getAllReviews()

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Reviews</h1>
                    <p className="text-gray-400">Manage customer feedback and publish official replies.</p>
                </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden glass-card">
                {reviews.length === 0 ? (
                    <div className="p-12 text-center flex flex-col items-center">
                        <MessageSquare className="w-12 h-12 text-white/20 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">No Reviews Yet</h3>
                        <p className="text-gray-400">When customers review your products, they will appear here.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/10">
                        {reviews.map((review) => (
                            <div key={review.id} className="p-6 hover:bg-white/5 transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="flex items-center space-x-2 mb-1">
                                            <span className="font-bold text-white">{review.reviewerName}</span>
                                            <span className="text-gray-500 text-sm">• {format(new Date(review.createdAt), 'MMM d, yyyy')}</span>
                                        </div>
                                        <div className="text-sm text-accent-400 font-medium">
                                            Product: {review.productName || 'Unknown Product'}
                                        </div>
                                        <div className="flex items-center mt-2 space-x-1 text-yellow-400">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-600'}`} />
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-4 flex-col sm:flex-row gap-4 sm:gap-0">
                                        <div className="flex items-center">
                                            {review.status === 'approved' && <span className="flex items-center text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded"><CheckCircle className="w-3 h-3 mr-1" /> Approved</span>}
                                            {review.status === 'rejected' && <span className="flex items-center text-xs font-bold text-red-400 bg-red-400/10 px-2 py-1 rounded"><XCircle className="w-3 h-3 mr-1" /> Rejected</span>}
                                            {review.status === 'pending' && <span className="flex items-center text-xs font-bold text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded">Pending</span>}
                                        </div>
                                        
                                        <ReviewActionButtons reviewId={review.id} currentStatus={review.status as any} />
                                    </div>
                                </div>
                                
                                <p className="text-gray-300 italic mb-4">"{review.comment}"</p>
                                
                                <div className="mt-4 pl-4 border-l-2 border-accent-500 flex flex-col space-y-3">
                                    {review.adminReply ? (
                                        <div className="bg-black/30 p-3 rounded-md">
                                            <p className="text-xs font-bold text-accent-400 mb-1">Your Reply:</p>
                                            <p className="text-sm text-gray-300">{review.adminReply}</p>
                                        </div>
                                    ) : (
                                        <ReplyForm reviewId={review.id} />
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
