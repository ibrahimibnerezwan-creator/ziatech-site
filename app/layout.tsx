import type { Metadata } from 'next'
import { Space_Grotesk, Plus_Jakarta_Sans, IBM_Plex_Mono } from 'next/font/google'
import { Header } from '@/components/layout/header'
import { Toaster } from '@/components/ui/toaster'
import { Providers } from './providers'
import './globals.css'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-display-family' })
const plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-body-family' })
const ibmPlexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-mono-family' })

export const metadata: Metadata = {
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
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${plusJakarta.variable} ${ibmPlexMono.variable} min-h-screen bg-bg-primary text-text-primary overflow-x-hidden`}
        style={{ fontFamily: 'var(--font-body-family), system-ui, sans-serif' }}
        suppressHydrationWarning
      >
        <Providers>
          <Header />
          <main className="pt-20">
            {children}
          </main>
          <Toaster />
        </Providers>

        {/* Prism Forge: Dot Matrix Background Layer */}
        <div className="fixed inset-0 -z-50 pointer-events-none dot-matrix opacity-60" />

        {/* Prism Forge: Warm Ember Glow (distinct from Binary's cold blobs) */}
        <div className="fixed inset-0 -z-40 pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary-500/8 rounded-full blur-[150px] animate-ember-pulse transform-gpu" />
          <div className="absolute bottom-[-15%] left-[-5%] w-[500px] h-[500px] bg-accent-500/6 rounded-full blur-[130px] animate-ember-pulse transform-gpu" style={{ animationDelay: '2s' }} />
          <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] bg-gold-400/4 rounded-full blur-[100px] animate-ember-pulse transform-gpu" style={{ animationDelay: '4s' }} />
        </div>
      </body>
    </html>
  )
}
