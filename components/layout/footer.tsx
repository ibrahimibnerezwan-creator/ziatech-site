import Link from 'next/link'
import { Cpu, Facebook, Twitter, Instagram, Youtube, MapPin, Phone, Mail, MessageCircle } from 'lucide-react'
import { NewsletterForm } from './newsletter-form'
import { getStoreSettings } from '@/lib/data'

export async function Footer() {
    const settings = await getStoreSettings()
    
    // Default fallback values if empty
    const address = settings['address'] || 'BCS Computer City, Agargaon, Dhaka, Bangladesh'
    const phone = settings['phone'] || '+880 1712-345678'
    const email = settings['email'] || 'support@ztech.com'
    const whatsapp = settings['whatsapp'] || '01712-345678'
    const facebookUrl = settings['facebook'] || '#'

    return (
        <footer className="bg-bg-elevated/80 backdrop-blur-xl border-t border-white/5 pt-16 pb-8">
            <div className="container px-4 mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* BRAND */}
                    <div className="space-y-6">
                        <Link href="/" className="inline-block flex items-center space-x-2 group">
                            <Cpu className="w-8 h-8 text-accent-400" />
                            <span className="text-2xl font-bold tracking-tight text-white">
                                Z's <span className="text-accent-400 text-sm font-medium">Tech Shop</span>
                            </span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Your ultimate destination for premium electronics, robotics components, and DIY tech kits. Build the future with quality parts.
                        </p>
                        <div className="flex space-x-4">
                            <Link href={facebookUrl} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-accent-400 hover:bg-accent-400/10 transition-colors">
                                <Facebook className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-accent-400 hover:bg-accent-400/10 transition-colors">
                                <Twitter className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-accent-400 hover:bg-accent-400/10 transition-colors">
                                <Instagram className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-accent-400 hover:bg-accent-400/10 transition-colors">
                                <Youtube className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    {/* CONTACT */}
                    <div>
                        <h4 className="text-white font-bold mb-6 tracking-wide">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start text-gray-400 text-sm">
                                <MapPin className="w-5 h-5 mr-3 text-accent-400 shrink-0 mt-0.5" />
                                <span>{address}</span>
                            </li>
                            <li className="flex items-center text-gray-400 text-sm">
                                <Phone className="w-5 h-5 mr-3 text-accent-400 shrink-0" />
                                <span>{phone}</span>
                            </li>
                            <li className="flex items-center text-gray-400 text-sm">
                                <MessageCircle className="w-5 h-5 mr-3 text-accent-400 shrink-0" />
                                <span>WhatsApp: {whatsapp}</span>
                            </li>
                            <li className="flex items-center text-gray-400 text-sm">
                                <Mail className="w-5 h-5 mr-3 text-accent-400 shrink-0" />
                                <span>{email}</span>
                            </li>
                        </ul>
                    </div>

                    {/* QUICK LINKS */}
                    <div>
                        <h4 className="text-white font-bold mb-6 tracking-wide">Quick Links</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link href="/about" className="hover:text-accent-400 transition-colors">About Us</Link></li>
                            <li><Link href="/blog" className="hover:text-accent-400 transition-colors">Project Tutorials</Link></li>
                            <li><Link href="/contact" className="hover:text-accent-400 transition-colors">Contact Support</Link></li>
                            <li><Link href="/shipping" className="hover:text-accent-400 transition-colors">Shipping & Returns</Link></li>
                            <li><Link href="/privacy" className="hover:text-accent-400 transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* NEWSLETTER */}
                    <div>
                        <h3 className="font-bold text-white mb-6">Stay Updated</h3>
                        <p className="text-sm text-gray-400 mb-4">
                            Get the latest gadgets and DIY tips delivered to your inbox.
                        </p>
                        <NewsletterForm />
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
