import type { Metadata } from 'next'
import { Manrope, DM_Sans, Noto_Sans_Bengali, IBM_Plex_Mono } from 'next/font/google'
import { Header } from '@/components/layout/header'
import { ToasterProvider } from '@/components/providers/toaster-provider'
import { SiteFrame } from '@/components/layout/site-frame'
import { Footer } from '@/components/layout/footer'
import { Providers } from './providers'
import { SITE_URL } from '@/lib/site'
import './globals.css'

const manrope = Manrope({ subsets: ['latin'], variable: '--font-display-family' })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-body-family' })
const bengali = Noto_Sans_Bengali({ subsets: ['bengali'], variable: '--font-bengali-family' })
const ibmPlexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-mono-family' })

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: './' },
  openGraph: { type: 'website', siteName: 'ZiaTech', url: './', locale: 'en_BD' },
  title: "ZiaTech | Premium Electronics & Components",
  description: "Bangladesh's trusted source for premium electronics, IoT components, and tech accessories. Quality guaranteed, innovation delivered.",
  keywords: ['electronics', 'components', 'Bangladesh', 'tech', 'IoT', 'robotics', 'ZiaTech'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        className={`${manrope.variable} ${dmSans.variable} ${bengali.variable} ${ibmPlexMono.variable} min-h-screen bg-bg-primary text-text-primary`}
        style={{ fontFamily: 'var(--font-body-family), var(--font-bengali-family), system-ui, sans-serif' }}
        suppressHydrationWarning
      >
        <Providers>
          <SiteFrame header={<Header />} footer={<Footer />}>
            {children}
          </SiteFrame>
          <ToasterProvider />
        </Providers>

      </body>
    </html>
  )
}
