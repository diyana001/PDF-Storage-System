'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bell, LogOut, Menu, Search, UserRound } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { adminUser } from '@/lib/data'

export function AdminHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-card/90 px-4 backdrop-blur sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={() => setMenuOpen(true)}
        className="flex size-9 items-center justify-center rounded-md hover:bg-muted lg:hidden"
        aria-label="Open navigation"
      >
        <Menu className="size-5" />
      </button>
      <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
        <DialogContent className="top-0 left-0 h-dvh max-w-64! translate-x-0 translate-y-0 gap-0 rounded-none p-0">
          <DialogTitle className="sr-only">Admin navigation</DialogTitle>
          <AdminSidebar className="flex" onNavigate={() => setMenuOpen(false)} />
        </DialogContent>
      </Dialog>

      <div className="relative max-w-sm flex-1">
        <label htmlFor="admin-search" className="sr-only">
          Search admin
        </label>
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input id="admin-search" type="search" placeholder="Search documents, users…" className="h-10 bg-muted/60 pl-9" />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          className="relative flex size-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Notifications, 3 unread"
        >
          <Bell className="size-5" />
          <span className="absolute top-2 right-2 size-2 rounded-full bg-success ring-2 ring-card" aria-hidden="true" />
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex items-center gap-3 rounded-lg p-1 pr-2 hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            aria-label="Admin account menu"
          >
            <Avatar className="size-8">
              <AvatarFallback className="bg-foreground text-xs font-semibold text-background">{adminUser.initials}</AvatarFallback>
            </Avatar>
            <span className="hidden text-left sm:block">
              <span className="block text-sm leading-tight font-medium">{adminUser.name}</span>
              <span className="block text-xs text-muted-foreground">{adminUser.role}</span>
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                <span className="block text-sm font-medium text-foreground">{adminUser.name}</span>
                <span className="block text-xs font-normal">{adminUser.email}</span>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link href="/admin/settings" />}>
              <UserRound aria-hidden="true" /> Account settings
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
