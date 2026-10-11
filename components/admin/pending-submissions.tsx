'use client'

import { Check, Download, FileText, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { categories, formatSize } from '@/lib/data'

export function PendingSubmissions() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Pending submissions</h1>
        <p className="text-muted-foreground">Review community contributions before they appear in Browse and Trending.</p>
      </header>

      <aside className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-muted-foreground">
        Queue data and review actions will be connected when the backend is ready. This is a frontend preview.
      </aside>

      <section aria-label="Pending submission preview" className="flex flex-col gap-4">
        <article className="flex flex-col gap-5 rounded-xl border bg-card p-5 shadow-sm lg:flex-row lg:items-center">
          <div className="flex min-w-0 flex-1 items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
              <FileText className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-semibold">Example community study guide</h2>
                <Badge variant="secondary">{categories[2].name}</Badge>
                <Badge variant="outline">Pending review</Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Example submission description for the admin review queue.
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Submitted by Example Contributor <span aria-hidden="true">·</span> {formatSize(2.4)}{' '}
                <span aria-hidden="true">·</span> Awaiting backend data
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" className="h-9" disabled>
              <Download aria-hidden="true" /> Preview PDF
            </Button>
            <Button className="h-9" disabled>
              <Check aria-hidden="true" /> Approve
            </Button>
            <Button variant="destructive" className="h-9" disabled>
              <X aria-hidden="true" /> Reject
            </Button>
          </div>
        </article>
      </section>
    </div>
  )
}
