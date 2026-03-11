"use client"

import React, { useState, useEffect } from 'react'
import { Cloud, CheckCircle, XCircle, Loader2 } from 'lucide-react'

export function CloudflareStatus() {
    const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading')
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function checkStatus() {
            try {
                const res = await fetch('/api/upload/test')
                const data = await res.json()
                if (data.success) {
                    setStatus('connected')
                } else {
                    setStatus('error')
                    setError(data.error || 'Connection failed')
                }
            } catch (err) {
                setStatus('error')
                setError('Failed to reach server')
            }
        }
        checkStatus()
    }, [])

    return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="bg-accent-500/20 p-2 rounded-lg">
                        <Cloud className="w-5 h-5 text-accent-500" />
                    </div>
                    <h3 className="font-bold text-white">Cloudflare R2 Storage</h3>
                </div>
                {status === 'loading' && <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />}
                {status === 'connected' && <CheckCircle className="w-5 h-5 text-green-500" />}
                {status === 'error' && <XCircle className="w-5 h-5 text-red-500" />}
            </div>

            <div className="space-y-1">
                <div className="flex justify-between text-xs">
                    <span className="text-gray-500 uppercase">Status</span>
                    <span className={`font-medium ${status === 'connected' ? 'text-green-400' : status === 'error' ? 'text-red-400' : 'text-gray-400'}`}>
                        {status === 'loading' ? 'Checking...' : status === 'connected' ? 'Connected' : 'Disconnected'}
                    </span>
                </div>
                {error && (
                    <p className="text-[10px] text-red-400/60 leading-tight mt-2 italic">
                        {error}
                    </p>
                )}
            </div>
        </div>
    )
}
