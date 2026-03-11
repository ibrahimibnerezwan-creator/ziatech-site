"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { Cpu, Battery, Radio, Settings, Bot, Plane, Smartphone, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'

const targetDevices = [Bot, Plane, Smartphone]
const components = [
    { Icon: Cpu, color: 'text-blue-400', border: 'border-blue-400/30' },
    { Icon: Battery, color: 'text-emerald-400', border: 'border-emerald-400/30' },
    { Icon: Radio, color: 'text-purple-400', border: 'border-purple-400/30' },
    { Icon: Settings, color: 'text-orange-400', border: 'border-orange-400/30' },
    { Icon: Zap, color: 'text-yellow-400', border: 'border-yellow-400/30' },
]

export function HeroAnimation() {
    const [centerIndex, setCenterIndex] = useState(0)

    // Cycle through target devices in the center every 4 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCenterIndex((prev) => (prev + 1) % targetDevices.length)
        }, 4000)
        return () => clearInterval(interval)
    }, [])

    const CenterIcon = targetDevices[centerIndex]

    return (
        <div className="relative w-full h-[400px] md:h-[600px] flex items-center justify-center overflow-hidden pointer-events-none">
            
            {/* Inner Ring (Pulsing) */}
            <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 m-auto w-[200px] h-[200px] rounded-full border-2 border-accent-500/50"
            />

            {/* Orbiting Components */}
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 m-auto w-[320px] h-[320px] rounded-full border border-dashed border-white/10"
            >
                {components.map((comp, i) => {
                    const angle = (i * Math.PI * 2) / components.length
                    const radius = 160
                    const x = radius * Math.cos(angle)
                    const y = radius * Math.sin(angle)
                    
                    return (
                        <div 
                           key={i} 
                           className={`absolute flex items-center justify-center w-12 h-12 -ml-6 -mt-6 rounded-full border bg-black/50 backdrop-blur-md ${comp.border}`}
                           style={{ left: '50%', top: '50%', transform: `translate(${x}px, ${y}px)` }}
                        >
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                            >
                                <comp.Icon className={`w-5 h-5 ${comp.color}`} />
                            </motion.div>
                        </div>
                    )
                })}
            </motion.div>

            {/* Converging Energy Particles */}
            {components.map((_, i) => (
                <motion.div
                    key={`particle-${i}`}
                    animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0],
                        x: [(160 * Math.cos((i * Math.PI * 2) / components.length)), 0],
                        y: [(160 * Math.sin((i * Math.PI * 2) / components.length)), 0],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.4,
                        ease: "easeInOut"
                    }}
                    className="absolute z-10 w-2 h-2 bg-accent-400 rounded-full shadow-[0_0_10px_#06b6d4]"
                />
            ))}

            {/* Center Assembled Device */}
            <div className="relative z-20 flex items-center justify-center w-36 h-36 rounded-3xl bg-black/40 border border-accent-500/30 backdrop-blur-xl shadow-[0_0_50px_rgba(6,182,212,0.15)]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={centerIndex}
                        initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        exit={{ scale: 1.5, opacity: 0 }}
                        transition={{ duration: 0.5, type: 'spring' }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <CenterIcon className="w-16 h-16 text-accent-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]" />
                    </motion.div>
                </AnimatePresence>
            </div>
            
        </div>
    )
}
