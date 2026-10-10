import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { MockAuthProvider } from '@/lib/mock-auth'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: {
    default: 'PDFHub — Document Store & Management',
    template: '%s · PDFHub',
  },
  description:
    'PDFHub is a clean, fast portal to store, search, preview, read and download PDF documents — with personal libraries and full admin control.',
  icons: {
    icon: '/icon.svg?v=2',
    apple: '/apple-icon.png?v=2',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#2563EB',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} bg-background`}>
      <body className="antialiased">
        <MockAuthProvider>{children}</MockAuthProvider>
      </body>
    </html>
  )
}