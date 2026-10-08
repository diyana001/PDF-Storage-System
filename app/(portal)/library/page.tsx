import type { Metadata } from 'next'
import { LibraryView, type LibraryTab } from '@/components/library/library-view'

export const metadata: Metadata = {
  title: 'My Library',
  description: 'Your profile, downloaded files and saved documents.',
}

const tabs: LibraryTab[] = ['profile', 'downloads', 'saved']

export default async function LibraryPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams
  const active = tabs.includes(tab as LibraryTab) ? (tab as LibraryTab) : 'downloads'
  return <LibraryView tab={active} />
}
