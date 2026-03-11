"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { registerAction } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { UserPlus, ArrowRight } from 'lucide-react'

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)

        const formData = new FormData(e.currentTarget)
        const password = formData.get('password') as string
        const confirmPassword = formData.get('confirmPassword') as string

        if (password !== confirmPassword) {
            toast({
                title: "Passwords don't match",
                description: "Please ensure both password fields match exactly.",
                variant: "destructive",
            })
            setIsLoading(false)
            return
        }

        const result = await registerAction(formData)

        if (result?.error) {
            toast({
                title: "Registration Failed",
                description: result.error,
                variant: "destructive",
            })
            setIsLoading(false)
        } else {
            toast({
                title: "Account Created!",
                description: "Welcome to Z's Tech Shop! You are now logged in.",
            })
            router.push('/')
            router.refresh()
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-500/10 rounded-full blur-[100px] -z-10" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-2xl glass-card"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-accent-500/20 text-accent-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-accent-500/30">
                        <UserPlus className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Create an Account</h1>
                    <p className="text-gray-400">Join the maker community today.</p>
                </div>

                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                            <Input
                                id="name"
                                name="name"
                                required
                                disabled={isLoading}
                                className="bg-black/40 border-white/10 text-white focus:ring-accent-500/50"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                required
                                disabled={isLoading}
                                className="bg-black/40 border-white/10 text-white focus:ring-accent-500/50"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            disabled={isLoading}
                            className="bg-black/40 border-white/10 text-white focus:ring-accent-500/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-gray-300">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            required
                            disabled={isLoading}
                            className="bg-black/40 border-white/10 text-white focus:ring-accent-500/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password</Label>
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            required
                            disabled={isLoading}
                            className="bg-black/40 border-white/10 text-white focus:ring-accent-500/50"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-accent-500 hover:bg-accent-600 text-black font-bold py-6 text-lg group"
                    >
                        {isLoading ? "Creating Account..." : "Register"}
                        {!isLoading && <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
                    </Button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-400">
                    Already have an account?{' '}
                    <Link href="/login" className="text-white hover:text-primary-400 font-medium transition-colors">
                        Log in instead
                    </Link>
                </div>
            </motion.div>
        </div>
    )
}
