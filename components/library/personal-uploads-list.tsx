'use client'

import { FileText, LockKeyhole } from 'lucide-react'

export function PersonalUploadsList() {
  return (
    <div className="flex flex-col gap-4">
      <aside className="flex items-start gap-3 rounded-xl border border-primary/20 bg-secondary/50 p-4 text-sm">
        <LockKeyhole className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
        <p className="text-muted-foreground">
          These are your personal uploads. They are kept separate from public catalog documents and downloaded files,
          and are visible only to you.
        </p>
      </aside>
      <div className="rounded-xl border border-dashed bg-card p-8 text-center">
        <FileText className="mx-auto size-8 text-muted-foreground" aria-hidden="true" />
        <h2 className="mt-3 font-semibold">Your personal uploads will appear here</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          The upload interface is ready. Personal file storage will be connected by the backend team.
        </p>
      </div>
    </div>
  )
}
