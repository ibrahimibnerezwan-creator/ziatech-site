"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export function CountdownTimer({ targetDate }: { targetDate: Date }) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime()
            const distance = targetDate.getTime() - now

            if (distance < 0) {
                clearInterval(interval)
                return
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000)
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [targetDate])

    const TimeUnit = ({ value, label }: { value: number, label: string }) => (
        <div className="flex flex-col items-center mx-2">
            <motion.div
                key={value}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-12 h-12 md:w-16 md:h-16 bg-white/5 backdrop-blur-md rounded-lg border border-white/10 flex items-center justify-center mb-1"
            >
                <span className="text-xl md:text-2xl font-bold font-mono text-accent-400">
                    {value.toString().padStart(2, '0')}
                </span>
            </motion.div>
            <span className="text-[10px] uppercase tracking-wider text-gray-500">{label}</span>
        </div>
    )

    return (
        <div className="flex items-center justify-center">
            <TimeUnit value={timeLeft.hours} label="Hrs" />
            <span className="text-2xl font-bold text-white/20 mb-6">:</span>
            <TimeUnit value={timeLeft.minutes} label="Mins" />
            <span className="text-2xl font-bold text-white/20 mb-6">:</span>
            <TimeUnit value={timeLeft.seconds} label="Secs" />
        </div>
    )
}
