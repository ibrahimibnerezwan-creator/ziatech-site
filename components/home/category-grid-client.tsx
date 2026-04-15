"use client"

import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface CategoryItem {
    id: string;
    slug: string;
    name: string;
    description: string;
    className: string;
    gradient: string;
    image: string;
}

interface CategoryGridClientProps {
    categories: CategoryItem[];
}

export function CategoryGridClient({ categories }: CategoryGridClientProps) {
    if (categories.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500 border border-white/10 rounded-xl bg-white/5">
                No categories available yet. Please add them in the admin panel.
            </div>
        )
    }

    return (
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
                    <Link href={`/category/${cat.slug}`} className="block h-full w-full">
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
    )
}
