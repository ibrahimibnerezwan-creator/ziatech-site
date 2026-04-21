"use client"

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { updateOrderStatus } from '@/app/admin/actions'

const STATUSES = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as const

export function OrderActions({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
    const [status, setStatus] = useState(currentStatus)
    const [isPending, startTransition] = useTransition()

    function onUpdate() {
        if (status === currentStatus) {
            toast.info('Status unchanged')
            return
        }
        startTransition(async () => {
            const result = await updateOrderStatus(orderId, status)
            if (result?.success) {
                toast.success('Order status updated')
            } else {
                toast.error(result?.error || 'Failed to update status')
            }
        })
    }

    return (
        <div className="flex items-center gap-3">
            <Button
                type="button"
                variant="outline"
                onClick={() => window.print()}
                className="border-white/10 text-white hover:bg-white/5 rounded-full px-6 font-bold uppercase tracking-widest text-xs h-11"
            >
                Print Invoice
            </Button>
            <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={isPending}
                className="bg-bg-void/60 border border-white/10 rounded-full px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500 h-11"
            >
                {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                ))}
            </select>
            <Button
                type="button"
                onClick={onUpdate}
                disabled={isPending}
                className="bg-primary-500 text-white hover:bg-primary-600 rounded-full px-8 font-bold uppercase tracking-widest text-xs h-11 shadow-lg shadow-primary-500/20"
            >
                {isPending ? 'Updating...' : 'Update Status'}
            </Button>
        </div>
    )
}
