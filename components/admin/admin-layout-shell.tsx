'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { AdminHeader } from '@/components/admin/admin-header'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { useMockAuth } from '@/lib/mock-auth'

export function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { isAdmin, isReady } = useMockAuth()

  useEffect(() => {
    if (isReady && !isAdmin) {
      router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`)
    }
  }, [isAdmin, isReady, pathname, router])

  if (!isReady || !isAdmin) return <div className="min-h-dvh bg-background" aria-busy="true" />

  return (
    <div className="flex min-h-dvh bg-background">
      <AdminSidebar className="hidden w-64 shrink-0 border-r bg-card lg:flex" />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  )
}