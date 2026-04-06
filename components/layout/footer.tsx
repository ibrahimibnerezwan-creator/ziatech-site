import Link from 'next/link'
import { Hexagon, Facebook, Twitter, Instagram, Youtube, MapPin, Phone, Mail, MessageCircle } from 'lucide-react'
import { NewsletterForm } from './newsletter-form'
import { getStoreSettings } from '@/lib/data'

export async function Footer() {
    const settings = await getStoreSettings()
    
    // Default fallback values if empty
    const address = settings['address'] || 'BCS Computer City, Agargaon, Dhaka, Bangladesh'
    const phone = settings['phone'] || '+880 1712-345678'
    const email = settings['email'] || 'support@ziatech.com'
    const whatsapp = settings['whatsapp'] || '01712-345678'
    const facebookUrl = settings['facebook'] || '#'

    return (
        <footer className="bg-bg-void/90 backdrop-blur-xl border-t border-primary-500/5 pt-16 pb-8">
            <div className="container px-4 mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* BRAND */}
                    <div className="space-y-6">
                        <Link href="/" className="inline-flex items-center space-x-2.5 group">
                            <Hexagon className="w-8 h-8 text-primary-400" strokeWidth={1.5} />
                            <span className="text-2xl font-display font-bold tracking-tight text-white">
                                Zia<span className="text-primary-400">Tech</span>
                            </span>
                        </Link>
                        <p className="text-text-secondary text-sm leading-relaxed">
                            Your trusted destination for premium electronics, robotics components, and DIY tech kits. Build the future with quality parts.
                        </p>
                        <div className="flex space-x-3">
                            <Link href={facebookUrl} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-text-muted hover:text-primary-400 hover:bg-primary-500/10 hover:border-primary-500/20 border border-transparent transition-all duration-200">
                                <Facebook className="w-4 h-4" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-text-muted hover:text-primary-400 hover:bg-primary-500/10 hover:border-primary-500/20 border border-transparent transition-all duration-200">
                                <Twitter className="w-4 h-4" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-text-muted hover:text-primary-400 hover:bg-primary-500/10 hover:border-primary-500/20 border border-transparent transition-all duration-200">
                                <Instagram className="w-4 h-4" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-text-muted hover:text-primary-400 hover:bg-primary-500/10 hover:border-primary-500/20 border border-transparent transition-all duration-200">
                                <Youtube className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* CONTACT */}
                    <div>
                        <h4 className="text-white font-display font-bold mb-6 tracking-wide">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start text-text-secondary text-sm">
                                <MapPin className="w-5 h-5 mr-3 text-primary-400 shrink-0 mt-0.5" />
                                <span>{address}</span>
                            </li>
                            <li className="flex items-center text-text-secondary text-sm">
                                <Phone className="w-5 h-5 mr-3 text-primary-400 shrink-0" />
                                <span>{phone}</span>
                            </li>
                            <li className="flex items-center text-text-secondary text-sm">
                                <MessageCircle className="w-5 h-5 mr-3 text-primary-400 shrink-0" />
                                <span>WhatsApp: {whatsapp}</span>
                            </li>
                            <li className="flex items-center text-text-secondary text-sm">
                                <Mail className="w-5 h-5 mr-3 text-primary-400 shrink-0" />
                                <span>{email}</span>
                            </li>
                        </ul>
                    </div>

                    {/* QUICK LINKS */}
                    <div>
                        <h4 className="text-white font-display font-bold mb-6 tracking-wide">Quick Links</h4>
                        <ul className="space-y-3 text-sm text-text-secondary">
                            <li><Link href="/about" className="hover:text-primary-400 transition-colors">About Us</Link></li>
                            <li><Link href="/blog" className="hover:text-primary-400 transition-colors">Project Tutorials</Link></li>
                            <li><Link href="/contact" className="hover:text-primary-400 transition-colors">Contact Support</Link></li>
                            <li><Link href="/shipping" className="hover:text-primary-400 transition-colors">Shipping & Returns</Link></li>
                            <li><Link href="/privacy" className="hover:text-primary-400 transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* NEWSLETTER */}
                    <div>
                        <h3 className="font-display font-bold text-white mb-6">Stay Updated</h3>
                        <p className="text-sm text-text-secondary mb-4">
                            Get the latest components and project ideas delivered to your inbox.
                        </p>
                        <NewsletterForm />
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-text-muted">
                    <p>© {new Date().getFullYear()} ZiaTech. All rights reserved.</p>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <Link href="/privacy" className="hover:text-primary-400 transition-colors">Terms</Link>
                        <Link href="/privacy" className="hover:text-primary-400 transition-colors">Cookies</Link>
                        <Link href="/about" className="hover:text-primary-400 transition-colors">Sitemap</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
