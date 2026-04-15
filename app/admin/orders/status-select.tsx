'use client'

import { useState } from 'react'
import { updateOrderStatus } from '@/app/admin/actions'
import { Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatusSelectProps {
    orderId: string;
    currentStatus: string;
}

const statuses = [
    { value: 'PENDING', label: 'Pending', color: 'text-yellow-400' },
    { value: 'PROCESSING', label: 'Processing', color: 'text-blue-400' },
    { value: 'SHIPPED', label: 'Shipped', color: 'text-primary-400' },
    { value: 'DELIVERED', label: 'Delivered', color: 'text-emerald-400' },
    { value: 'CANCELLED', label: 'Cancelled', color: 'text-red-400' },
]

export function StatusSelect({ orderId, currentStatus }: StatusSelectProps) {
    const [status, setStatus] = useState(currentStatus)
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const handleChange = async (newStatus: string) => {
        if (newStatus === status) return
        
        setIsLoading(true)
        setIsSuccess(false)
        
        try {
            const result = await updateOrderStatus(orderId, newStatus)
            if (result.success) {
                setStatus(newStatus)
                setIsSuccess(true)
                setTimeout(() => setIsSuccess(false), 2000)
            } else {
                alert(result.error || 'Failed to update status')
            }
        } catch (error) {
            console.error('Error updating status:', error)
            alert('An unexpected error occurred')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="relative inline-flex items-center group">
            <select
                value={status}
                onChange={(e) => handleChange(e.target.value)}
                disabled={isLoading}
                className={cn(
                    "appearance-none bg-black/20 border border-white/10 rounded-full px-4 py-1.5 pr-8 text-xs font-bold uppercase tracking-widest focus:outline-none focus:ring-1 focus:ring-primary-500/50 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
                    status === 'DELIVERED' ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' :
                    status === 'SHIPPED' ? 'text-blue-400 border-blue-500/20 bg-blue-500/5' :
                    status === 'CANCELLED' ? 'text-red-400 border-red-500/20 bg-red-500/5' :
                    status === 'PROCESSING' ? 'text-primary-400 border-primary-500/20 bg-primary-500/5' :
                    'text-yellow-400 border-yellow-500/20 bg-yellow-500/5'
                )}
            >
                {statuses.map((s) => (
                    <option key={s.value} value={s.value} className="bg-bg-void text-white">
                        {s.label}
                    </option>
                ))}
            </select>
            
            <div className="absolute right-3 pointer-events-none">
                {isLoading ? (
                    <Loader2 className="w-3 h-3 animate-spin text-primary-400" />
                ) : isSuccess ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                    <div className="w-0.5 h-0.5 bg-text-muted rounded-full shadow-[0_0_8px_rgba(255,255,255,0.5)] group-hover:scale-150 transition-transform" />
                )}
            </div>
        </div>
    )
}
