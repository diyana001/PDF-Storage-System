'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Bookmark, Download, UserRound } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { documents, downloadedIds, savedIds } from '@/lib/data'
import { ProfileSettings } from '@/components/library/profile-settings'
import { DownloadedList } from '@/components/library/downloaded-list'
import { SavedGrid } from '@/components/library/saved-grid'
import { cn } from '@/lib/utils'
import { useMockAuth } from '@/lib/mock-auth'

export type LibraryTab = 'profile' | 'downloads' | 'saved'

const nav = [
  { tab: 'profile', label: 'Profile Settings', icon: UserRound },
  { tab: 'downloads', label: 'My Downloaded Files', icon: Download, count: downloadedIds.length },
  { tab: 'saved', label: 'Saved Documents', icon: Bookmark, count: savedIds.length },
] as const

const titles: Record<LibraryTab, { title: string; description: string }> = {
  profile: { title: 'Profile settings', description: 'Manage your personal details and notification preferences.' },
  downloads: { title: 'My downloaded files', description: 'Every document you have downloaded, most recent first.' },
  saved: { title: 'Saved documents', description: 'Documents you bookmarked to read later.' },
}

export function LibraryView({ tab }: { tab: LibraryTab }) {
  const router = useRouter()
  const { user, isReady } = useMockAuth()
  const downloaded = downloadedIds.map((id) => documents.find((d) => d.id === id)!).filter(Boolean)
  const saved = savedIds.map((id) => documents.find((d) => d.id === id)!).filter(Boolean)

  useEffect(() => {
    if (isReady && !user) router.replace(`/login?next=${encodeURIComponent(`/library?tab=${tab}`)}`)
  }, [isReady, router, tab, user])

  if (!isReady || !user) return <div className="min-h-[40vh]" aria-busy="true" />

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
      <aside className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
        <div className="flex items-center gap-3 rounded-xl border bg-card p-4 shadow-sm">
          <Avatar className="size-12">
            <AvatarFallback className="bg-primary font-semibold text-primary-foreground">{user.initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-semibold">{user.name}</p>
            <p className="truncate text-sm text-muted-foreground">Member since {user.joined}</p>
          </div>
        </div>
        <nav aria-label="Library" className="rounded-xl border bg-card p-2 shadow-sm">
          <ul className="flex gap-1 overflow-x-auto lg:flex-col">
            {nav.map((item) => {
              const active = item.tab === tab
              return (
                <li key={item.tab} className="shrink-0">
                  <Link
                    href={`/library?tab=${item.tab}`}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    )}
                  >
                    <item.icon className="size-4" aria-hidden="true" />
                    <span className="flex-1 whitespace-nowrap">{item.label}</span>
                    {'count' in item ? (
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 text-xs tabular-nums',
                          active ? 'bg-white/20' : 'bg-muted text-muted-foreground',
                        )}
                      >
                        {item.count}
                      </span>
                    ) : null}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>

      <section className="flex min-w-0 flex-col gap-6" aria-labelledby="library-heading">
        <div className="flex flex-col gap-1">
          <h1 id="library-heading" className="text-2xl font-bold tracking-tight sm:text-3xl">
            {titles[tab].title}
          </h1>
          <p className="text-muted-foreground">{titles[tab].description}</p>
        </div>
        {tab === 'profile' ? <ProfileSettings /> : null}
        {tab === 'downloads' ? <DownloadedList docs={downloaded} /> : null}
        {tab === 'saved' ? <SavedGrid docs={saved} /> : null}
      </section>
    </div>
  )
}
