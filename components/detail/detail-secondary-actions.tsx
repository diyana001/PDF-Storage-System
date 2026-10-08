'use client'

import { useState } from 'react'
import { Bookmark, BookmarkCheck, Check, Link2, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function DetailSecondaryActions({ docId, initiallySaved }: { docId: string; initiallySaved: boolean }) {
  const [saved, setSaved] = useState(initiallySaved)
  const [copied, setCopied] = useState(false)

  async function copyLink() {
    await navigator.clipboard.writeText(`${window.location.origin}/documents/${docId}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={() => setSaved((s) => !s)} aria-pressed={saved}>
        {saved ? <BookmarkCheck className="text-primary" aria-hidden="true" /> : <Bookmark aria-hidden="true" />}
        {saved ? 'Saved to library' : 'Save for later'}
      </Button>
      <Button variant="outline" onClick={copyLink}>
        {copied ? <Check className="text-success" aria-hidden="true" /> : <Link2 aria-hidden="true" />}
        {copied ? 'Link copied' : 'Copy link'}
      </Button>
      <Button variant="ghost" onClick={() => window.print()}>
        <Printer aria-hidden="true" />
        Print details
      </Button>
      <span className="sr-only" aria-live="polite">
        {copied ? 'Link copied to clipboard' : ''}
      </span>
    </div>
  )
}
