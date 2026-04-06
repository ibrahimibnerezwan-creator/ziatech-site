"use client"

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/*
  PRISM FORGE Hero: Product Spotlight with Orbiting Tech Elements
  
  Concept: A central glowing hexagonal "forge" with orbiting product
  category icons. Products cycle through with a warm dissolve effect.
  Completely distinct from Binary's converging-component assembly.
  
  Zero WebGL. Zero canvas. Pure CSS + Framer Motion.
*/

// Orbiting tech category badges
const orbitItems = [
    { label: 'IoT', color: 'hsl(25, 95%, 55%)', emoji: '📡' },
    { label: 'Robotics', color: 'hsl(340, 80%, 60%)', emoji: '🤖' },
    { label: 'Arduino', color: 'hsl(45, 90%, 55%)', emoji: '⚡' },
    { label: 'Sensors', color: 'hsl(160, 70%, 50%)', emoji: '🔬' },
    { label: 'Motors', color: 'hsl(280, 70%, 60%)', emoji: '⚙️' },
    { label: 'Displays', color: 'hsl(200, 80%, 55%)', emoji: '🖥️' },
]

// Center showcase products (cycling)
const showcaseProducts = [
    {
        name: 'Smart Controller',
        tagline: 'ESP32 Dev Board',
        gradient: 'from-primary-400 to-accent-400',
    },
    {
        name: 'Precision Sensor',
        tagline: 'Industrial Grade',
        gradient: 'from-accent-400 to-gold-400',
    },
    {
        name: 'Servo Pack',
        tagline: 'High-Torque Kit',
        gradient: 'from-gold-400 to-primary-400',
    },
]

export function HeroAnimation() {
    const [currentProduct, setCurrentProduct] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentProduct(prev => (prev + 1) % showcaseProducts.length)
        }, 3500)
        return () => clearInterval(timer)
    }, [])

    const product = showcaseProducts[currentProduct]

    return (
        <div className="relative w-full h-full flex items-center justify-center pointer-events-none select-none">

            {/* Outer orbit ring */}
            <div className="absolute w-[280px] h-[280px] md:w-[400px] md:h-[400px] rounded-full border border-primary-500/10" />
            <div className="absolute w-[220px] h-[220px] md:w-[320px] md:h-[320px] rounded-full border border-primary-500/5" />

            {/* Orbiting category badges */}
            {orbitItems.map((item, i) => {
                const angle = (i * 360) / orbitItems.length
                const orbitRadius = typeof window !== 'undefined' && window.innerWidth < 768 ? 130 : 190

                return (
                    <motion.div
                        key={item.label}
                        className="absolute z-10 transform-gpu"
                        animate={{
                            rotate: [angle, angle + 360],
                        }}
                        transition={{
                            duration: 30,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                        style={{
                            width: orbitRadius * 2,
                            height: orbitRadius * 2,
                            willChange: 'transform',
                        }}
                    >
                        <motion.div
                            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
                            animate={{ rotate: [-angle, -(angle + 360)] }}
                            transition={{
                                duration: 30,
                                repeat: Infinity,
                                ease: 'linear',
                            }}
                        >
                            <div
                                className="flex items-center space-x-1.5 bg-bg-elevated/80 backdrop-blur-sm rounded-full px-3 py-1.5 border shadow-lg"
                                style={{
                                    borderColor: `${item.color}25`,
                                    boxShadow: `0 0 20px ${item.color}10`,
                                }}
                            >
                                <span className="text-sm">{item.emoji}</span>
                                <span className="text-[11px] font-medium" style={{ color: item.color }}>
                                    {item.label}
                                </span>
                            </div>
                        </motion.div>
                    </motion.div>
                )
            })}

            {/* Center: Hexagonal Forge Glow */}
            <div className="absolute w-32 h-32 md:w-44 md:h-44 transform-gpu">
                {/* Warm glow backdrop */}
                <div className="absolute inset-0 bg-primary-500/15 rounded-full blur-3xl animate-ember-pulse" />
                <div className="absolute inset-[-20%] bg-accent-500/8 rounded-full blur-2xl animate-ember-pulse" style={{ animationDelay: '1.5s' }} />
            </div>

            {/* Center: Product showcase (cycling) */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentProduct}
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="absolute z-20 flex flex-col items-center transform-gpu"
                    style={{ willChange: 'transform, opacity' }}
                >
                    {/* Product hexagon container */}
                    <div className={`w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br ${product.gradient} p-[2px] shadow-2xl`}>
                        <div className="w-full h-full rounded-3xl bg-bg-primary/90 backdrop-blur-sm flex items-center justify-center">
                            <div className={`text-3xl md:text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br ${product.gradient}`}>
                                Z
                            </div>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="mt-4 text-center"
                    >
                        <p className="text-sm md:text-base font-display font-semibold text-white tracking-wide">
                            {product.name}
                        </p>
                        <p className="text-[11px] md:text-xs font-mono text-text-muted tracking-widest uppercase mt-1">
                            {product.tagline}
                        </p>
                    </motion.div>
                </motion.div>
            </AnimatePresence>

            {/* Decorative connecting lines (subtle) */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.04]" viewBox="0 0 400 400">
                <line x1="200" y1="0" x2="200" y2="400" stroke="currentColor" strokeWidth="0.5" className="text-primary-400" />
                <line x1="0" y1="200" x2="400" y2="200" stroke="currentColor" strokeWidth="0.5" className="text-primary-400" />
                <line x1="50" y1="50" x2="350" y2="350" stroke="currentColor" strokeWidth="0.5" className="text-primary-400" />
                <line x1="350" y1="50" x2="50" y2="350" stroke="currentColor" strokeWidth="0.5" className="text-primary-400" />
            </svg>
        </div>
    )
}
