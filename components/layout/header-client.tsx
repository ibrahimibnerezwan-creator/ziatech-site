'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Search, ShoppingBag, UserRound, Menu, X, Package, Heart, ArrowUpRight, ChevronDown } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { logoutAction } from '@/app/auth/actions'
import { Brand } from './brand'

interface HeaderClientProps {
  categories: Array<{ id: string; name: string; slug: string }>
  user?: { id: string; name: string } | null
  phone: string
}

export function HeaderClient({ categories, user, phone }: HeaderClientProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const [query, setQuery] = useState('')
  const accountRef = useRef<HTMLDivElement>(null)
  const menuButton = useRef<HTMLButtonElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const { totalItems } = useCart()

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        if (menuOpen) menuButton.current?.focus()
        if (userOpen) accountRef.current?.querySelector('button')?.focus()
        setMenuOpen(false)
        setUserOpen(false)
      }
    }
    function onOutside(event: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) setUserOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('click', onOutside)
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('click', onOutside) }
  }, [menuOpen, userOpen])

  function search(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const term = query.trim()
    if (!term) return
    setMenuOpen(false)
    router.push(`/category/all?q=${encodeURIComponent(term)}`)
  }
  async function logout() {
    setUserOpen(false)
    setMenuOpen(false)
    await logoutAction()
    window.location.href = '/'
  }

  const links = [
    { href: '/category/all', label: 'All products' },
    ...categories.slice(0, 4).map(c => ({ href: `/category/${c.slug}`, label: c.name })),
    { href: '/blog', label: 'Project guides' },
  ]

  return (
    <header className="site-header">
      <div className="store-container header-main">
        <Brand />
        <nav className="header-primary-nav" aria-label="Main navigation">
          <Link href="/category/all" aria-current={pathname.startsWith('/category/') ? 'page' : undefined}>Shop</Link>
          <Link href="/categories" aria-current={pathname === '/categories' ? 'page' : undefined}>Categories</Link>
          <Link href="/blog" aria-current={pathname === '/blog' ? 'page' : undefined}>Guides</Link>
          <Link href="/contact" aria-current={pathname === '/contact' ? 'page' : undefined}>Help</Link>
        </nav>
        <form role="search" className="header-search" onSubmit={search}>
          <input type="search" aria-label="Search products" placeholder="Search components, kits, modules..." value={query} onChange={e => setQuery(e.target.value)} />
          <button type="submit" aria-label="Search"><Search size={18} /></button>
        </form>
        <div className="header-actions">
          {user ? (
            <div className="header-account" ref={accountRef}>
              <button className="header-action account-toggle" onClick={() => setUserOpen(!userOpen)} aria-expanded={userOpen} aria-controls="account-menu" aria-label={user.name}>
                <UserRound size={21} /><span>{user.name}</span><ChevronDown size={13} />
              </button>
              {userOpen && <div id="account-menu" className="account-menu">
                <p>Hi, {user.name}</p>
                <Link href="/my-orders" onClick={() => setUserOpen(false)}>My orders</Link>
                <button onClick={logout}>Logout</button>
              </div>}
            </div>
          ) : <Link href="/login" aria-label="Sign in" className="header-action account-toggle"><UserRound size={21} /><span>Account</span></Link>}
          <Link href="/wishlist" aria-label="Wishlist" className="header-action"><Heart size={21} /><span>Saved</span></Link>
          <Link href="/cart" aria-label="Shopping cart" className="header-action cart-link"><ShoppingBag size={21} /><span>Cart</span><span className="cart-count">{totalItems}</span></Link>
          <button ref={menuButton} className="mobile-menu-toggle" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
      </div>
      {menuOpen && <nav id="mobile-navigation" className="mobile-navigation" aria-label="Mobile navigation">
        {links.map(link => <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}<ArrowUpRight size={17} /></Link>)}
        <Link href="/my-orders" onClick={() => setMenuOpen(false)}>Track your order<Package size={17} /></Link>
        <Link href="/contact" onClick={() => setMenuOpen(false)}>Contact & support</Link>
        {phone && <a href={`tel:${phone.replace(/[^+\d]/g, '')}`}>{phone}</a>}
      </nav>}
    </header>
  )
}
