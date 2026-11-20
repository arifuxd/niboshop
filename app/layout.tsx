import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Noto_Sans_Bengali } from 'next/font/google'
import { CartProvider } from '@/lib/cart'
import { LanguageProvider } from '@/lib/language'
import { Toaster } from '@/components/ui/sonner'
import { siteConfig } from '@/lib/site-config'
import './globals.css'

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })
const notoBengali = Noto_Sans_Bengali({ subsets: ['bengali'], variable: '--font-noto-bengali' })

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} – ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  generator: 'v0.app',
}

export const viewport: Viewport = {
  themeColor: '#f47b20',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${notoBengali.variable}`}>
      <body className="font-sans antialiased">
        <CartProvider>
          <LanguageProvider>
            {children}
            <Toaster position="top-center" richColors />
          </LanguageProvider>
        </CartProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
