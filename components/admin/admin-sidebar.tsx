'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ExternalLink, FileText, FolderTree, LayoutDashboard, Settings, Users } from 'lucide-react'
import { Logo } from '@/components/logo'
import { cn } from '@/lib/utils'

export const adminNav = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/documents', label: 'Manage Documents', icon: FileText },
  { href: '/admin/categories', label: 'Categories', icon: FolderTree },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export function AdminSidebar({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <aside className={cn('sticky top-0 h-dvh flex-col', className)}>
      <div className="flex h-16 items-center gap-2 border-b px-5">
        <Logo />
        <span className="rounded-md bg-secondary px-1.5 py-0.5 text-xs font-semibold text-secondary-foreground">Admin</span>
      </div>
      <nav aria-label="Admin" className="flex-1 overflow-y-auto p-3">
        <ul className="flex flex-col gap-1">
          {adminNav.map((item) => {
            const active = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  <item.icon className="size-4" aria-hidden="true" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="border-t p-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <ExternalLink className="size-4" aria-hidden="true" />
          View public portal
        </Link>
      </div>
    </aside>
  )
}
