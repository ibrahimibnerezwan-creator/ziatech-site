"use client"

import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export function NewsletterForm() {
    return (
        <div className="flex space-x-2">
            <Input placeholder="Enter your email" className="bg-black/30 border-white/10" />
            <Button
                size="icon"
                type="button"
                className="shrink-0 bg-accent-500 hover:bg-accent-600 text-black"
                onClick={() => {
                    toast.info("Coming Soon", {
                        description: "Newsletter subscription will be active shortly!",
                    })
                }}
            >
                <ArrowRight className="w-4 h-4" />
            </Button>
        </div>
    )
}
