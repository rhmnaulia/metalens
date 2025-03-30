import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#ffffff',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://metalens.dev'),
  title: 'MetaLens - Instant SEO & Social Media Preview Tool',
  description:
    "Analyze and preview your website's SEO metadata, social cards, and technical tags in real-time. Get instant insights for better visibility.",
  keywords:
    'SEO, metadata, social media preview, meta tags, website analysis, SEO checker, social cards',
  authors: [{ name: 'Aulia Rahman', url: 'https://github.com/rhmnaulia' }],
  creator: 'Aulia Rahman',
  publisher: 'Aulia Rahman',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://metalens.dev',
    siteName: 'MetaLens',
    title: 'MetaLens - Instant SEO & Social Media Preview Tool',
    description:
      "Analyze and preview your website's SEO metadata, social cards, and technical tags in real-time. Get instant insights for better visibility.",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MetaLens Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MetaLens - Instant SEO & Social Media Preview Tool',
    description:
      "Analyze and preview your website's SEO metadata, social cards, and technical tags in real-time. Get instant insights for better visibility.",
    images: ['/og-image.png'],
    creator: '@rhmnaul',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
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
