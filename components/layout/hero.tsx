"use client"

import { motion } from 'framer-motion'
import { ArrowRight, Flame } from 'lucide-react'
import { Button } from '@/components/ui/button'
import dynamic from 'next/dynamic'
import Link from 'next/link'

const HeroAnimation = dynamic(() => import('@/components/layout/hero-animation').then(m => m.HeroAnimation), {
    ssr: false,
    loading: () => <div className="w-full h-[400px] md:h-[550px] flex items-center justify-center"><div className="w-16 h-16 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" /></div>
})

export function Hero() {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
            {/* Diagonal Split Background — distinct from Binary's plain void */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-900/40 via-transparent to-accent-500/10" />
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-500/5 to-transparent clip-diagonal hidden md:block" />
            </div>

            <div className="container px-4 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center relative z-10">

                {/* TEXT CONTENT */}
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="space-y-8 text-center md:text-left order-2 md:order-1"
                >
                    {/* Tag — pill badge style, NOT Binary's rectangle */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center space-x-2 border border-primary-500/25 bg-primary-500/8 rounded-full px-5 py-2 backdrop-blur-sm"
                    >
                        <Flame className="w-4 h-4 text-primary-400" />
                        <span className="text-sm font-medium text-primary-300">Premium Components, Crafted for Builders</span>
                    </motion.div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight leading-[1.1]">
                        FORGE YOUR <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-accent-400 to-gold-400 bg-[length:200%_auto] animate-[gradient-shift_4s_ease-in-out_infinite]">
                            NEXT BUILD
                        </span>
                    </h1>

                    <p className="text-base md:text-lg text-text-secondary max-w-lg mx-auto md:mx-0 leading-relaxed">
                        Bangladesh&apos;s trusted marketplace for electronics, robotics, and IoT components.
                        Quality parts, expert support, lightning delivery.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-5 justify-center md:justify-start">
                        <Link href="/categories">
                            <Button size="lg" className="rounded-full px-8 text-base bg-primary-500 hover:bg-primary-600 text-white hover:scale-105 transition-all duration-200 group shadow-lg shadow-primary-500/20">
                                Browse Catalog
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>

                        <Link href="/about">
                            <Button variant="outline" size="lg" className="rounded-full px-8 text-base border-primary-500/30 text-primary-300 hover:bg-primary-500/10 hover:border-primary-500/50 transition-all duration-200">
                                Our Story
                            </Button>
                        </Link>
                    </div>

                    {/* Stats — pill badges (distinct from Binary's divider layout) */}
                    <div className="pt-6 flex flex-wrap items-center justify-center md:justify-start gap-3">
                        <div className="flex items-center space-x-2 bg-white/5 rounded-full px-4 py-2 border border-white/5">
                            <span className="text-lg font-bold text-white font-display">50k+</span>
                            <span className="text-xs text-text-muted">Components</span>
                        </div>
                        <div className="flex items-center space-x-2 bg-white/5 rounded-full px-4 py-2 border border-white/5">
                            <span className="text-lg font-bold text-white font-display">24h</span>
                            <span className="text-xs text-text-muted">Delivery</span>
                        </div>
                        <div className="flex items-center space-x-2 bg-white/5 rounded-full px-4 py-2 border border-white/5">
                            <span className="text-lg font-bold text-white font-display">4.9★</span>
                            <span className="text-xs text-text-muted">Trusted</span>
                        </div>
                    </div>
                </motion.div>

                {/* VISUAL — Product Spotlight (NOT Binary's SVG assembly) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="relative h-[350px] sm:h-[400px] md:h-[550px] w-full flex items-center justify-center order-1 md:order-2"
                >
                    <HeroAnimation />
                </motion.div>

            </div>

            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary to-transparent" />
        </section>
    )
}
