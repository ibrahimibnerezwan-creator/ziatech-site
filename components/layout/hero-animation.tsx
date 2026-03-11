"use client"

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/*
  Pure CSS + minimal framer-motion animation.
  Concept: Small IC/component icons float inward and visually "merge" 
  into a central product (Drone → Smartphone → Robot), which cycles.
  Zero WebGL. Zero canvas. Maximum performance via transform-gpu.
*/

// Simple SVG icons as inline paths to avoid importing anything heavy
const ChipIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
        <rect x="6" y="6" width="12" height="12" rx="1" />
        <path d="M9 1v4M15 1v4M9 19v4M15 19v4M1 9h4M1 15h4M19 9h4M19 15h4" />
    </svg>
)

const ResistorIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
        <path d="M2 12h3l1.5-4 3 8 3-8 3 8 1.5-4H22" />
    </svg>
)

const BatteryIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
        <rect x="2" y="7" width="18" height="10" rx="2" />
        <path d="M22 11v2" />
        <path d="M6 11v2" />
    </svg>
)

const WifiIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
        <path d="M12 20h.01" />
        <path d="M8.5 16.5a5 5 0 017 0" />
        <path d="M5 12.5a10 10 0 0114 0" />
        <path d="M2 8.5a15 15 0 0120 0" />
    </svg>
)

const GearIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
)

// Center product SVGs
const DroneIcon = () => (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
        <circle cx="12" cy="12" r="8" />
        <circle cx="52" cy="12" r="8" />
        <circle cx="12" cy="52" r="8" />
        <circle cx="52" cy="52" r="8" />
        <line x1="12" y1="12" x2="32" y2="32" />
        <line x1="52" y1="12" x2="32" y2="32" />
        <line x1="12" y1="52" x2="32" y2="32" />
        <line x1="52" y1="52" x2="32" y2="32" />
        <rect x="26" y="26" width="12" height="12" rx="3" />
    </svg>
)

const PhoneIcon = () => (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
        <rect x="16" y="4" width="32" height="56" rx="6" />
        <line x1="24" y1="10" x2="40" y2="10" />
        <circle cx="32" cy="52" r="3" />
        <rect x="20" y="16" width="24" height="28" rx="2" />
    </svg>
)

const RobotIcon = () => (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
        <rect x="16" y="20" width="32" height="28" rx="6" />
        <circle cx="26" cy="34" r="4" />
        <circle cx="38" cy="34" r="4" />
        <path d="M28 42h8" />
        <line x1="32" y1="12" x2="32" y2="20" />
        <circle cx="32" cy="10" r="3" />
        <line x1="10" y1="30" x2="16" y2="34" />
        <line x1="54" y1="30" x2="48" y2="34" />
        <line x1="24" y1="48" x2="20" y2="58" />
        <line x1="40" y1="48" x2="44" y2="58" />
    </svg>
)

const componentParts = [
    { Icon: ChipIcon, color: '#3b82f6', label: 'IC' },
    { Icon: ResistorIcon, color: '#a855f7', label: 'R' },
    { Icon: BatteryIcon, color: '#22c55e', label: 'BAT' },
    { Icon: WifiIcon, color: '#06b6d4', label: 'RF' },
    { Icon: GearIcon, color: '#f97316', label: 'MOT' },
]

const assembledProducts = [
    { Icon: DroneIcon, name: 'Drone' },
    { Icon: PhoneIcon, name: 'Smart Device' },
    { Icon: RobotIcon, name: 'Robot' },
]

export function HeroAnimation() {
    const [productIndex, setProductIndex] = useState(0)
    const [phase, setPhase] = useState<'converge' | 'assembled'>('converge')

    useEffect(() => {
        const timer = setInterval(() => {
            setPhase('converge')
            setTimeout(() => {
                setPhase('assembled')
                setProductIndex(prev => (prev + 1) % assembledProducts.length)
            }, 1200)
        }, 3500)

        // Start assembled
        setPhase('assembled')
        return () => clearInterval(timer)
    }, [])

    const Product = assembledProducts[productIndex]

    return (
        <div className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center pointer-events-none select-none">

            {/* Converging component parts */}
            {componentParts.map((part, i) => {
                const angle = (i * 360) / componentParts.length
                const radius = phase === 'converge' ? 140 : 0
                const rad = (angle * Math.PI) / 180

                return (
                    <motion.div
                        key={part.label}
                        animate={{
                            x: Math.cos(rad) * radius,
                            y: Math.sin(rad) * radius,
                            opacity: phase === 'converge' ? 1 : 0,
                            scale: phase === 'converge' ? 1 : 0.2,
                        }}
                        transition={{ duration: 0.8, ease: 'easeInOut' }}
                        className="absolute z-10 transform-gpu"
                        style={{ willChange: 'transform, opacity' }}
                    >
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-black/60 border border-white/10 backdrop-blur-sm flex items-center justify-center"
                            style={{ color: part.color, borderColor: `${part.color}40` }}
                        >
                            <div className="w-5 h-5 md:w-6 md:h-6">
                                <part.Icon />
                            </div>
                        </div>
                        <span className="block text-[10px] text-center mt-1 font-mono opacity-60" style={{ color: part.color }}>
                            {part.label}
                        </span>
                    </motion.div>
                )
            })}

            {/* Center: Assembled product */}
            <AnimatePresence mode="wait">
                {phase === 'assembled' && (
                    <motion.div
                        key={productIndex}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
                        className="absolute z-20 flex flex-col items-center transform-gpu"
                        style={{ willChange: 'transform, opacity' }}
                    >
                        <div className="w-28 h-28 md:w-36 md:h-36 text-accent-400 drop-shadow-[0_0_30px_rgba(6,182,212,0.4)]">
                            <Product.Icon />
                        </div>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mt-3 text-sm font-mono text-accent-400/80 tracking-widest uppercase"
                        >
                            {Product.name}
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Subtle glow behind center */}
            <div className="absolute w-40 h-40 bg-accent-500/10 rounded-full blur-3xl transform-gpu" />
        </div>
    )
}
