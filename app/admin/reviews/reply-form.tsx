'use client'

import { useState } from 'react'
import { replyToReview } from '@/app/admin/reviews/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Loader2 } from 'lucide-react'

export default function ReplyForm({ reviewId }: { reviewId: string }) {
    const [isReplying, setIsReplying] = useState(false)
    const [replyText, setReplyText] = useState('')

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!replyText.trim()) return
        
        setIsReplying(true)
        await replyToReview(reviewId, replyText)
        setIsReplying(false)
        setReplyText('')
    }

    return (
        <form onSubmit={handleSubmit} className="flex space-x-2 w-full max-w-lg mt-2 relative">
            <Input 
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write an official response..." 
                className="bg-black/40 border-white/10 text-white placeholder:text-gray-500 pr-12 focus:border-accent-500" 
            />
            <Button 
                type="submit" 
                size="sm" 
                disabled={isReplying || !replyText.trim()}
                className="absolute right-1 top-1 bottom-1 h-auto bg-accent-500 text-black hover:bg-accent-600 px-3"
            >
                {isReplying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
        </form>
    )
}
