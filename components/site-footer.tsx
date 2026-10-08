import Link from 'next/link'
import { Logo } from '@/components/logo'

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t bg-card">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="hidden sm:inline">Your organized PDF library.</span>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/browse" className="hover:text-foreground">Browse</Link>
          <Link href="/library" className="hover:text-foreground">My Library</Link>
          <Link href="/admin" className="hover:text-foreground">Admin</Link>
          <span>{'© 2026 PDFHub'}</span>
        </nav>
      </div>
    </footer>
  )
}
