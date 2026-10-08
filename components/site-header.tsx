'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Bookmark, Download, LayoutDashboard, LogOut, Search, Settings } from 'lucide-react'
import { Logo } from '@/components/logo'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { currentUser } from '@/lib/data'

export function SiteHeader() {
  const router = useRouter()

  function onSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const q = new FormData(e.currentTarget).get('q')?.toString().trim() ?? ''
    router.push(q ? `/browse?q=${encodeURIComponent(q)}` : '/browse')
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-card/75">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Logo className="shrink-0" />

        <nav aria-label="Primary" className="hidden items-center gap-1 text-sm font-medium lg:flex">
          <Link href="/" className="rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground">
            Home
          </Link>
          <Link href="/browse" className="rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground">
            Browse
          </Link>
          <Link href="/library" className="rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground">
            My Library
          </Link>
        </nav>

        <form role="search" onSubmit={onSearch} className="mx-auto w-full max-w-md flex-1">
          <label htmlFor="global-search" className="sr-only">
            Search documents
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              id="global-search"
              name="q"
              type="search"
              placeholder="Search documents, authors, tags…"
              className="h-10 rounded-full bg-muted/60 pl-9"
            />
          </div>
        </form>

        <DropdownMenu>
          <DropdownMenuTrigger
            className="shrink-0 rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            aria-label="Open account menu"
          >
            <Avatar className="size-9">
              <AvatarFallback className="bg-primary font-medium text-primary-foreground">
                {currentUser.initials}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                <span className="block text-sm font-medium text-foreground">{currentUser.name}</span>
                <span className="block text-xs font-normal text-muted-foreground">{currentUser.email}</span>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link href="/library?tab=downloads" />}>
              <Download aria-hidden="true" /> My Downloads
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/library?tab=saved" />}>
              <Bookmark aria-hidden="true" /> Saved Documents
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/library?tab=profile" />}>
              <Settings aria-hidden="true" /> Profile Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link href="/admin" />}>
              <LayoutDashboard aria-hidden="true" /> Admin Portal
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/login" />}>
              <LogOut aria-hidden="true" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
