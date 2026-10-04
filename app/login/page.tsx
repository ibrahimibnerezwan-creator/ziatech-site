"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { loginAction } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { LogIn, ShieldCheck, ArrowRight } from 'lucide-react'

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()

    const requestedFrom = searchParams.get('from') || ''
    const from = requestedFrom.startsWith('/') && !requestedFrom.startsWith('//') && !requestedFrom.includes('\\') ? requestedFrom : ''
    const isAdminLogin = from.startsWith('/admin')

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)

        const formData = new FormData(e.currentTarget)
        const result = await loginAction(formData)

        if (result?.error) {
            toast.error(result.error)
            setIsLoading(false)
        } else {
            toast.success('Welcome back!')
            const redirectTo = from || (result.role === 'admin' ? '/admin' : '/')
            router.push(redirectTo)
            router.refresh()
        }
    }

    // ==================== ADMIN LOGIN ====================
    if (isAdminLogin) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4 relative overflow-hidden">

                <motion.div
                    initial={false}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md relative"
                >
                    <div className="relative bg-bg-elevated border border-line  p-6 sm:p-10 rounded-2xl shadow-sm">

                        <div className="text-center mb-10">
                            <motion.div
                                initial={false}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.15 }}
                                className="w-20 h-20 bg-red-500/10 text-red-700 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-red-500/20 shadow-none"
                            >
                                <ShieldCheck className="w-9 h-9" />
                            </motion.div>
                            <h1 className="text-3xl font-display font-bold text-text-primary mb-2 tracking-tight">Admin Access</h1>
                            <p className="text-text-secondary text-sm">Restricted area. Authorized personnel only.</p>
                        </div>

                        <form onSubmit={onSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-text-secondary text-xs font-bold uppercase tracking-wider">Username</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="text"
                                    placeholder="Admin username"
                                    required
                                    autoFocus
                                    disabled={isLoading}
                                    className="bg-bg-void/60 border-line text-text-primary focus:ring-red-500/30 focus:border-red-500/30 rounded-xl h-12"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-text-secondary text-xs font-bold uppercase tracking-wider">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    disabled={isLoading}
                                    className="bg-bg-void/60 border-line text-text-primary focus:ring-red-500/30 focus:border-red-500/30 rounded-xl h-12"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-red-500 hover:bg-red-600 text-text-primary h-12 text-base rounded-xl group font-bold shadow-none mt-2"
                            >
                                {isLoading ? "Authenticating..." : "Enter Admin Panel"}
                                {!isLoading && <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <Link href="/login" className="text-xs text-text-muted hover:text-text-primary transition-colors">
                                Back to customer login
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        )
    }

    // ==================== CUSTOMER LOGIN ====================
    return (
        <div className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4 relative overflow-hidden">

            <motion.div
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative"
            >
                <div className="relative bg-bg-elevated border border-line  p-6 sm:p-10 rounded-2xl shadow-sm">

                    <div className="text-center mb-10">
                        <motion.div
                            initial={false}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.15 }}
                            className="w-20 h-20 bg-primary-500/10 text-primary-400 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-primary-500/20 shadow-none"
                        >
                            <LogIn className="w-9 h-9" />
                        </motion.div>
                        <h1 className="text-3xl font-display font-bold text-text-primary mb-2 tracking-tight">Welcome Back</h1>
                        <p className="text-text-secondary text-sm">Sign in to access your orders and saved items.</p>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-text-secondary text-xs font-bold uppercase tracking-wider">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                required
                                disabled={isLoading}
                                className="bg-bg-void/60 border-line text-text-primary focus:ring-primary-500/30 focus:border-primary-500/30 rounded-xl h-12"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="password" className="text-text-secondary text-xs font-bold uppercase tracking-wider">Password</Label>
                                <Link href="/contact" className="text-xs text-primary-400 hover:text-primary-300 transition-colors font-medium">
                                    Forgot?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                disabled={isLoading}
                                className="bg-bg-void/60 border-line text-text-primary focus:ring-primary-500/30 focus:border-primary-500/30 rounded-xl h-12"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary-500 hover:bg-primary-600 text-text-primary h-12 text-base rounded-xl group font-bold shadow-none mt-2"
                        >
                            {isLoading ? "Signing in..." : "Sign In"}
                            {!isLoading && <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
                        </Button>
                    </form>

                    <div className="mt-8 text-center text-sm text-text-muted">
                        Don&apos;t have an account?{' '}
                        <Link href="/register" className="text-primary-400 hover:text-primary-300 font-bold transition-colors">
                            Create one
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
