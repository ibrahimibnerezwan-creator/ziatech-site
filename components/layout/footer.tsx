"use client"

import Link from 'next/link'
import { Facebook, Instagram, Twitter, Youtube, MapPin, Mail, Phone, Cpu, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function Footer() {
    return (
        <footer className="border-t border-white/10 bg-bg-elevated/50 pt-16 pb-8 backdrop-blur-lg">
            <div className="container px-4 mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* BRAND */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center space-x-2">
                            <Cpu className="w-8 h-8 text-accent-400" />
                            <span className="text-2xl font-bold tracking-tight text-white">
                                Z's <span className="text-accent-400">Tech Shop</span>
                            </span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Dhaka's premium destination for electronics, dev boards, and smart gadgets.
                            Curated solutions for the modern maker.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-accent-400 transition-colors"><Facebook className="w-5 h-5" /></a>
                            <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors"><Instagram className="w-5 h-5" /></a>
                            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors"><Twitter className="w-5 h-5" /></a>
                            <a href="#" className="text-gray-400 hover:text-red-500 transition-colors"><Youtube className="w-5 h-5" /></a>
                        </div>
                    </div>

                    {/* QUICK LINKS */}
                    <div>
                        <h3 className="font-bold text-white mb-6">Quick Links</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link href="/about" className="hover:text-accent-400 transition-colors">About Us</Link></li>
                            <li><Link href="/blog" className="hover:text-accent-400 transition-colors">Project Tutorials</Link></li>
                            <li><Link href="/contact" className="hover:text-accent-400 transition-colors">Contact Support</Link></li>
                            <li><Link href="/shipping" className="hover:text-accent-400 transition-colors">Shipping & Returns</Link></li>
                            <li><Link href="/privacy" className="hover:text-accent-400 transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* CONTACT INFO */}
                    <div>
                        <h3 className="font-bold text-white mb-6">Contact Us</h3>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li className="flex items-start space-x-3">
                                <MapPin className="w-5 h-5 text-accent-500 shrink-0" />
                                <span>2/1/E, Eden Center, Arambagh,<br />Motijheel, Dhaka-1000</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone className="w-5 h-5 text-accent-500 shrink-0" />
                                <span>+880 9678-110110</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail className="w-5 h-5 text-accent-500 shrink-0" />
                                <span>hello@ziatech.shop</span>
                            </li>
                        </ul>
                    </div>

                    {/* NEWSLETTER */}
                    <div>
                        <h3 className="font-bold text-white mb-6">Stay Updated</h3>
                        <p className="text-sm text-gray-400 mb-4">
                            Get the latest gadgets and DIY tips delivered to your inbox.
                        </p>
                        <div className="flex space-x-2">
                            <Input placeholder="Enter your email" className="bg-black/30 border-white/10" />
                            <Button
                                size="icon"
                                className="shrink-0 bg-accent-500 hover:bg-accent-600 text-black"
                                onClick={() => {
                                    const { toast } = require('@/hooks/use-toast');
                                    toast({
                                        title: "Coming Soon",
                                        description: "Newsletter subscription will be active shortly!",
                                    })
                                }}
                            >
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
                    <p>© {new Date().getFullYear()} Z's Tech Shop. All rights reserved.</p>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <span>Terms</span>
                        <span>Cookies</span>
                        <span>Sitemap</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
