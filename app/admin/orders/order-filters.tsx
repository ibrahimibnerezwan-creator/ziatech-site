'use client'

import { useState, useEffect, useTransition } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

export function OrderFilters() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()

    const [search, setSearch] = useState(searchParams.get('search') || '')
    const [status, setStatus] = useState(searchParams.get('status') || 'ALL')

    function handleFilterChange(key: string, value: string) {
        const params = new URLSearchParams(searchParams.toString())
        
        if (value && value !== 'ALL') {
            params.set(key, value)
        } else {
            params.delete(key)
        }

        // Reset page if we have pagination (not yet implemented but good practice)
        params.delete('page')

        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`)
        })
    }

    // Debounced search update
    useEffect(() => {
        const timer = setTimeout(() => {
            handleFilterChange('search', search)
        }, 500)
        return () => clearTimeout(timer)
    }, [search])

    function clearFilters() {
        setSearch('')
        setStatus('ALL')
        router.push(pathname)
    }

    return (
        <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-bg-elevated/40 border border-white/5 rounded-2xl backdrop-blur-sm">
            <div className="relative flex-1 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary-400 transition-colors" />
                <Input
                    placeholder="Search name, phone, or ID..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 bg-black/20 border-white/10 text-white placeholder:text-text-muted/50 focus:border-primary-500/50 transition-all rounded-xl"
                />
                {search && (
                    <button 
                        onClick={() => setSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-white transition-colors"
                    >
                        <X className="w-3 h-3" />
                    </button>
                )}
            </div>

            <div className="flex gap-2">
                <Select 
                    value={status} 
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        const val = e.target.value;
                        setStatus(val); 
                        handleFilterChange('status', val);
                    }}
                    className="w-[160px]"
                >
                    <option value="ALL">All Statuses</option>
                    <option value="PENDING">Pending</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                </Select>

                {(search || status !== 'ALL') && (
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={clearFilters}
                        className="text-text-muted hover:text-white hover:bg-white/5 rounded-xl px-3"
                    >
                        Clear
                    </Button>
                )}
            </div>

            {isPending && (
                <div className="flex items-center text-[10px] text-primary-400 animate-pulse font-mono uppercase tracking-widest px-2">
                    Syncing...
                </div>
            )}
        </div>
    )
}
