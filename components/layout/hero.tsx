"use client"

import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import dynamic from 'next/dynamic'
import Link from 'next/link'

const HeroAnimation = dynamic(() => import('@/components/layout/hero-animation').then(m => m.HeroAnimation), {
    ssr: false,
    loading: () => <div className="w-full h-[400px] md:h-[600px] flex items-center justify-center"><div className="w-20 h-20 border-2 border-accent-500/30 border-t-accent-500 rounded-full animate-spin" /></div>
})

export function Hero() {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-transparent -z-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/20 rounded-full blur-[150px] animate-pulse-glow" />
            </div>

            <div className="container px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">

                {/* TEXT CONTENT */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="space-y-8 text-center md:text-left"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center space-x-2 border border-accent-500/30 bg-accent-500/10 rounded-full px-4 py-1.5 backdrop-blur-sm"
                    >
                        <Sparkles className="w-4 h-4 text-accent-400" />
                        <span className="text-sm font-medium text-accent-400">The Future of DIY Electronics</span>
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-tight">
                        BUILD THE <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 bg-300% animate-gradient">
                            IMPOSSIBLE
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-400 max-w-xl mx-auto md:mx-0 leading-relaxed">
                        Bangladesh's premium source for robotics, IoT, and high-performance components.
                        Experience the next generation of making.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 justify-center md:justify-start">
                        <Link href="/categories">
                            <Button size="lg" className="rounded-full px-8 text-lg hover:scale-105 transition-transform group">
                                Start Building
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>

                        <Link href="/about">
                            <Button variant="neon" size="lg" className="rounded-full px-8 text-lg">
                                Explore Projects
                            </Button>
                        </Link>
                    </div>

                    <div className="pt-8 flex items-center justify-center md:justify-start space-x-8 text-gray-500">
                        <div>
                            <p className="text-2xl font-bold text-white">50k+</p>
                            <p className="text-sm">Components</p>
                        </div>
                        <div className="w-px h-10 bg-white/10" />
                        <div>
                            <p className="text-2xl font-bold text-white">24h</p>
                            <p className="text-sm">Delivery</p>
                        </div>
                        <div className="w-px h-10 bg-white/10" />
                        <div>
                            <p className="text-2xl font-bold text-white">4.9/5</p>
                            <p className="text-sm">Trust Score</p>
                        </div>
                    </div>
                </motion.div>

                {/* 3D VISUAL */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="relative h-[400px] md:h-[600px] w-full flex items-center justify-center"
                >
                    <HeroAnimation />
                </motion.div>

            </div>
        </section>
    )
}
