'use client'

import { usePathname } from 'next/navigation'
import { ChatWidget } from '@/components/shared/ChatWidget'

export function SiteFrame({ header, footer, children }: { header: React.ReactNode; footer: React.ReactNode; children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')
  return (
    <div className={isAdmin ? 'admin-theme' : 'storefront'}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      {header}
      <main id="main-content" tabIndex={-1}>{children}</main>
      {!isAdmin && footer}
      {!isAdmin && pathname !== '/checkout' && <ChatWidget />}
    </div>
  )
}
