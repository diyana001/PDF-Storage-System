'use client'

import { useState } from 'react'
import Link from 'next/link'
import { LockKeyhole, Users } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { UploadDialog } from '@/components/upload-dialog'
import { useMockAuth } from '@/lib/mock-auth'

export function UploadPage() {
  const { user, isReady } = useMockAuth()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [uploadType, setUploadType] = useState<'personal' | 'public'>('personal')
  const [submittedTitle, setSubmittedTitle] = useState<{ title: string; type: 'personal' | 'public' } | null>(null)

  if (!isReady) {
    return <div className="min-h-80" aria-busy="true" />
  }

  if (!user) {
    return (
      <div className="mx-auto flex min-h-80 max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <section className="flex max-w-lg flex-col items-center gap-4 rounded-xl border bg-card p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold tracking-tight">Sign in to upload</h1>
          <p className="text-muted-foreground">Sign in to your PDFHub account before uploading a document.</p>
          <Link href="/login?next=%2Fupload" className={buttonVariants()}>
            Sign in
          </Link>
        </section>
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Upload a document</h1>
        <p className="text-muted-foreground">Choose a private upload or submit a document for public review.</p>
      </div>
      {submittedTitle ? (
        <section role="status" className="flex max-w-lg flex-col gap-3 rounded-xl border bg-card p-6 shadow-sm">
          {submittedTitle.type === 'personal' ? (
            <>
              <h2 className="text-lg font-semibold">Personal upload preview complete</h2>
              <p className="text-sm text-muted-foreground">
                “{submittedTitle.title}” was captured in the form preview only. It was not saved; the backend will connect this upload to your private My Uploads section.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-lg font-semibold">Public submission preview complete</h2>
              <p className="text-sm text-muted-foreground">
                “{submittedTitle.title}” was captured in the form preview only. It was not submitted; the backend will connect this form to the admin approval queue.
              </p>
            </>
          )}
          <div>
            {submittedTitle.type === 'personal' ? (
              <Link href="/library?tab=uploads" className={buttonVariants()}>View My Uploads</Link>
            ) : (
              <Link href="/browse" className={buttonVariants({ variant: 'outline' })}>Browse documents</Link>
            )}
          </div>
        </section>
      ) : (
        <section className="max-w-2xl rounded-xl border bg-card p-6 shadow-sm">
          <div role="tablist" aria-label="Upload type" className="mb-6 grid grid-cols-2 gap-2 rounded-lg bg-muted p-1">
            <button
              type="button"
              role="tab"
              id="upload-tab-personal"
              aria-controls="upload-panel"
              aria-selected={uploadType === 'personal'}
              onClick={() => {
                setUploadType('personal')
                setDialogOpen(true)
              }}
              className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${uploadType === 'personal' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <LockKeyhole className="size-4" aria-hidden="true" />
              Personal vault
            </button>
            <button
              type="button"
              role="tab"
              id="upload-tab-public"
              aria-controls="upload-panel"
              aria-selected={uploadType === 'public'}
              onClick={() => {
                setUploadType('public')
                setDialogOpen(true)
              }}
              className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${uploadType === 'public' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Users className="size-4" aria-hidden="true" />
              Public contribution
            </button>
          </div>
          <div
            id="upload-panel"
            role="tabpanel"
            aria-labelledby={uploadType === 'personal' ? 'upload-tab-personal' : 'upload-tab-public'}
          >
            <p className="mb-5 text-sm text-muted-foreground">
              {uploadType === 'personal'
                ? 'Only you can see personal vault PDFs in My Library.'
                : 'Public contributions are reviewed by an administrator before appearing in Browse and Trending.'}
            </p>
            {dialogOpen ? (
              <UploadDialog
                key={uploadType}
                open
                onOpenChange={setDialogOpen}
                editing={null}
                privateUpload={uploadType === 'personal'}
                publicSubmission={uploadType === 'public'}
                onSubmit={(data) => {
                  setSubmittedTitle({ title: data.title, type: uploadType })
                }}
              />
            ) : (
              <div className="flex flex-col gap-4">
                <button
                  type="button"
                  onClick={() => setDialogOpen(true)}
                  className={buttonVariants()}
                >
                  {uploadType === 'personal' ? 'Upload to Personal Vault' : 'Submit for Public Review'}
                </button>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  )
}
