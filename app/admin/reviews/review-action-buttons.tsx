'use client'

import { useState } from 'react'
import { updateReviewStatus } from '@/app/admin/reviews/actions'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

interface ReviewActionButtonsProps {
    reviewId: string;
    currentStatus: 'pending' | 'approved' | 'rejected';
}

export default function ReviewActionButtons({ reviewId, currentStatus }: ReviewActionButtonsProps) {
    const [isUpdating, setIsUpdating] = useState(false)

    async function handleApprove() {
        setIsUpdating(true)
        await updateReviewStatus(reviewId, 'approved')
        setIsUpdating(false)
    }

    async function handleReject() {
        setIsUpdating(true)
        await updateReviewStatus(reviewId, 'rejected')
        setIsUpdating(false)
    }

    if (currentStatus !== 'pending') {
        // Option to undo could go here, but for simplicity we only show actions on pending
        return null;
    }

    return (
        <div className="flex items-center space-x-2">
            <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleApprove}
                disabled={isUpdating}
                className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10"
            >
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-1" />}
                Approve
            </Button>
            
            <Button 
                variant="ghost" 
                size="sm"
                onClick={handleReject}
                disabled={isUpdating}
                className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
            >
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4 mr-1" />}
                Reject
            </Button>
        </div>
    )
}
