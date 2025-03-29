import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MetaScope - Instant SEO & Social Media Preview Tool',
  description:
    "Analyze and preview your website's SEO metadata, social cards, and technical tags in real-time. Get instant insights for better visibility.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={cn(inter.className, 'min-h-screen antialiased')}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
