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
import { LogIn, ArrowRight } from 'lucide-react'

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()

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
            const from = searchParams.get('from')
            const redirectTo = from || (result.role === 'admin' ? '/admin' : '/')
            router.push(redirectTo)
            router.refresh()
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary-500/8 rounded-full blur-[150px] -z-10" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent-500/5 rounded-full blur-[120px] -z-10" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative"
            >
                <div className="absolute -inset-[1px] bg-gradient-to-b from-primary-500/20 to-transparent rounded-3xl blur-sm" />
                <div className="relative bg-bg-elevated/80 border border-white/5 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl">
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary-500/40 to-transparent" />

                    <div className="text-center mb-10">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.15 }}
                            className="w-20 h-20 bg-primary-500/10 text-primary-400 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-primary-500/20 shadow-lg shadow-primary-500/10"
                        >
                            <LogIn className="w-9 h-9" />
                        </motion.div>
                        <h1 className="text-3xl font-display font-bold text-white mb-2 tracking-tight">Welcome Back</h1>
                        <p className="text-text-secondary text-sm">Sign in to access your orders and saved items.</p>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-text-secondary text-xs font-bold uppercase tracking-wider">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="text"
                                placeholder="you@example.com"
                                required
                                disabled={isLoading}
                                className="bg-bg-void/60 border-white/8 text-white focus:ring-primary-500/30 focus:border-primary-500/30 rounded-xl h-12"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="password" className="text-text-secondary text-xs font-bold uppercase tracking-wider">Password</Label>
                                <Link href="#" className="text-xs text-primary-400 hover:text-primary-300 transition-colors font-medium">
                                    Forgot?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                disabled={isLoading}
                                className="bg-bg-void/60 border-white/8 text-white focus:ring-primary-500/30 focus:border-primary-500/30 rounded-xl h-12"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary-500 hover:bg-primary-600 text-white h-12 text-base rounded-xl group font-bold shadow-lg shadow-primary-500/20 mt-2"
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
