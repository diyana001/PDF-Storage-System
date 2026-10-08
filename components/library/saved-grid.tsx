'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BookmarkX, Bookmark } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { DocCard } from '@/components/doc-card'
import type { PdfDocument } from '@/lib/data'

export function SavedGrid({ docs }: { docs: PdfDocument[] }) {
  const [items, setItems] = useState(docs)

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed bg-card px-6 py-16 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-muted">
          <Bookmark className="size-6 text-muted-foreground" aria-hidden="true" />
        </span>
        <h2 className="font-semibold">No saved documents yet</h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          Use the &ldquo;Save for later&rdquo; button on any document to keep it here.
        </p>
        <Link href="/browse" className={buttonVariants({ variant: 'outline' })}>
          Browse the catalog
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((doc) => (
        <div key={doc.id} className="relative">
          <DocCard doc={doc} />
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-3 right-3 shadow-sm"
            onClick={() => setItems((list) => list.filter((d) => d.id !== doc.id))}
            aria-label={`Remove ${doc.title} from saved`}
            title="Remove from saved"
          >
            <BookmarkX />
          </Button>
        </div>
      ))}
    </div>
  )
}
