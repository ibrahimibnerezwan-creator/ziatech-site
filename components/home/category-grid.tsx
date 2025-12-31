"use client"

import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const categories = [
    {
        id: 'arduino',
        name: 'Arduino',
        description: 'Microcontrollers & Shields',
        className: 'md:col-span-2 md:row-span-2',
        gradient: 'from-blue-500/20 to-cyan-500/20',
        image: 'https://images.unsplash.com/photo-1555664424-778a69fdb6b8?q=80&w=1000&auto=format&fit=crop'
    },
    {
        id: 'esp32',
        name: 'ESP32 / IoT',
        description: 'WiFi & Bluetooth Modules',
        className: 'md:col-span-1 md:row-span-1',
        gradient: 'from-purple-500/20 to-pink-500/20',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop'
    },
    {
        id: 'sensors',
        name: 'Sensors',
        description: 'Environment, Motion, Gas',
        className: 'md:col-span-1 md:row-span-1',
        gradient: 'from-green-500/20 to-emerald-500/20',
        image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1000&auto=format&fit=crop'
    },
    {
        id: 'raspberry-pi',
        name: 'Raspberry Pi',
        description: 'Single Board Computers',
        className: 'md:col-span-2 md:row-span-1',
        gradient: 'from-red-500/20 to-orange-500/20',
        image: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=1000&auto=format&fit=crop'
    }
]

export function CategoryGrid() {
    return (
        <section className="container px-4 mx-auto">
            <div className="mb-12 flex justify-between items-end">
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
                        Explore Categories
                    </h2>
                    <p className="text-gray-400 mt-2">Everything you need for your next invention.</p>
                </div>
                <Link
                    href="/categories"
                    className="hidden md:flex items-center text-accent-400 hover:text-accent-300 transition-colors group"
                >
                    View All <ArrowUpRight className="ml-1 w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[250px]">
                {categories.map((cat, i) => (
                    <motion.div
                        key={cat.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                        viewport={{ once: true }}
                        className={cn(
                            "group relative overflow-hidden rounded-3xl border border-white/10 bg-bg-elevated cursor-pointer",
                            cat.className
                        )}
                    >
                        <Link href={`/category/${cat.id}`} className="block h-full w-full">
                            {/* Background Glow */}
                            <div className={cn(
                                "absolute inset-0 bg-gradient-to-br opacity-50 transition-opacity duration-500 group-hover:opacity-100",
                                cat.gradient
                            )} />

                            {/* Image Placeholder (Desaturated/Tinted) */}
                            <div
                                className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay transition-transform duration-700 group-hover:scale-110"
                                style={{ backgroundImage: `url(${cat.image})` }}
                            />

                            {/* Content */}
                            <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <h3 className="text-2xl font-bold text-white mb-1">{cat.name}</h3>
                                    <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                                        {cat.description}
                                    </p>
                                </div>

                                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:rotate-45">
                                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                                        <ArrowUpRight className="w-5 h-5 text-white" />
                                    </div>
                                </div>
                            </div>

                            {/* Shine Effect */}
                            <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                        </Link>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}
