import type { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

export const metadata: Metadata = {
  title: "Z's Tech Shop | Premium Electronics",
  description: "The ultimate hub for electronics and technology. High-quality gadgets curated by Z.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-bg-primary text-text-primary overflow-x-hidden selection:bg-accent-500/30 selection:text-white">
        <Header />
        <main className="pt-20">
          {children}
        </main>
        <Toaster />

        {/* Background Ambient Glow */}
        <div className="fixed inset-0 -z-50 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[100px] mix-blend-screen animate-pulse-glow transform-gpu" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent-500/10 rounded-full blur-[100px] mix-blend-screen animate-pulse-glow transform-gpu" style={{ animationDelay: '1s' }} />
        </div>
      </body>
    </html>
  )
}
