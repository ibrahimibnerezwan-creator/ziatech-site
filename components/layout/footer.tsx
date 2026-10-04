import Link from 'next/link'
import { ArrowUpRight, MapPin, Phone, Mail } from 'lucide-react'
import { getStoreSettings } from '@/lib/data'
import { Brand } from './brand'

export async function Footer() {
  const settings = await getStoreSettings()
  const phone = (settings.phone || '').replace(/[^+\d]/g, '')
  const whatsapp = (settings.whatsapp || settings.phone || '').replace(/\D/g, '').replace(/^0/, '880')
  return <footer className="site-footer"><div className="store-container">
    <div className="footer-top"><div className="footer-brand"><Brand inverse /><p>Small parts. Big possibilities.<br />Electronics for the maker in you.</p><div className="footer-socials">{['facebook','instagram','youtube','tiktok'].filter(key => /^https:\/\//.test(settings[key] || '')).map(key => <a key={key} href={settings[key]} target="_blank" rel="noopener noreferrer">{key}<ArrowUpRight size={14} /></a>)}</div></div>
    <div className="footer-links"><h2>Explore the shop</h2><Link href="/category/all">All components</Link><Link href="/categories">Shop by category</Link><Link href="/wishlist">Your wishlist</Link><Link href="/blog">Project guides</Link></div>
    <div className="footer-links"><h2>We&apos;re here to help</h2><Link href="/my-orders">Track your order</Link><Link href="/shipping">Shipping & returns</Link><Link href="/about">About ZiaTech</Link><Link href="/contact">Contact support</Link><Link href="/admin">Store admin</Link></div>
    <div className="footer-contact"><h2>Let&apos;s connect</h2>{settings.address && <p><MapPin size={16} />{settings.address}</p>}{phone && <a href={`tel:${phone}`}><Phone size={16} />{settings.phone}</a>}{settings.email && <a href={`mailto:${settings.email}`}><Mail size={16} />{settings.email}</a>}{whatsapp && <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="footer-whatsapp">Chat on WhatsApp <ArrowUpRight size={16} /></a>}</div></div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} ZiaTech. Made for possibility.</span><div><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><a href="/sitemap.xml">Sitemap</a></div><span className="footer-payments">Cash on delivery{settings.bkash_number && <span>bKash</span>}</span></div>
  </div></footer>
}
