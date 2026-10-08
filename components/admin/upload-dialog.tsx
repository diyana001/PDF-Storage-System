'use client'

import { useState } from 'react'
import { FileUp, FileText, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { categories, type CategorySlug, type PdfDocument } from '@/lib/data'
import { cn } from '@/lib/utils'

export type UploadedDoc = Pick<PdfDocument, 'title' | 'description' | 'category' | 'sizeMb'>

const categoryItems = categories.map((c) => ({ value: c.slug, label: c.name }))
const MAX_BYTES = 50 * 1024 * 1024

function formatBytes(bytes: number) {
  return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`
}

export function UploadDialog({
  open,
  onOpenChange,
  editing,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  editing: PdfDocument | null
  onSubmit: (data: UploadedDoc) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {open ? (
          <UploadForm
            key={editing?.id ?? 'new'}
            editing={editing}
            onSubmit={(data) => {
              onSubmit(data)
              onOpenChange(false)
            }}
            onCancel={() => onOpenChange(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

function UploadForm({
  editing,
  onSubmit,
  onCancel,
}: {
  editing: PdfDocument | null
  onSubmit: (data: UploadedDoc) => void
  onCancel: () => void
}) {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [category, setCategory] = useState<CategorySlug>(editing?.category ?? 'reports')

  function acceptFile(f: File | undefined) {
    if (!f) return
    if (f.type !== 'application/pdf' && !f.name.toLowerCase().endsWith('.pdf')) {
      setError('Only PDF files are supported.')
      return
    }
    if (f.size > MAX_BYTES) {
      setError('File is larger than 50 MB.')
      return
    }
    setError(null)
    setFile(f)
  }

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault()
        if (!editing && !file) {
          setError('Please choose a PDF to upload.')
          return
        }
        const form = new FormData(e.currentTarget)
        onSubmit({
          title: String(form.get('title')).trim(),
          description: String(form.get('description')).trim(),
          category,
          sizeMb: file ? Math.max(0.1, Math.round((file.size / 1024 / 1024) * 10) / 10) : editing!.sizeMb,
        })
      }}
    >
      <DialogHeader>
        <DialogTitle>{editing ? 'Edit document' : 'Upload new PDF'}</DialogTitle>
        <DialogDescription>
          {editing ? 'Update the document details shown in the catalog.' : 'Add a PDF to the public library. Max 50 MB.'}
        </DialogDescription>
      </DialogHeader>

      {!editing ? (
        file ? (
          <div className="flex items-center gap-3 rounded-lg border bg-muted/40 p-3">
            <span className="flex size-10 items-center justify-center rounded-md bg-destructive/10 text-destructive">
              <FileText className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
            </div>
            <Button type="button" variant="ghost" size="icon" onClick={() => setFile(null)} aria-label="Remove file">
              <X />
            </Button>
          </div>
        ) : (
          <label
            onDragOver={(e) => {
              e.preventDefault()
              setDragging(true)
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragging(false)
              acceptFile(e.dataTransfer.files[0])
            }}
            className={cn(
              'flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed px-6 py-8 text-center transition-colors focus-within:ring-2 focus-within:ring-ring',
              dragging ? 'border-primary bg-secondary' : 'hover:border-primary/50 hover:bg-muted/40',
            )}
          >
            <span className="flex size-11 items-center justify-center rounded-full bg-secondary text-primary">
              <FileUp className="size-5" aria-hidden="true" />
            </span>
            <span className="text-sm font-medium">
              <span className="text-primary">Click to choose</span> or drag a PDF here
            </span>
            <span className="text-xs text-muted-foreground">PDF only, up to 50 MB</span>
            <input
              type="file"
              accept="application/pdf,.pdf"
              className="sr-only"
              onChange={(e) => acceptFile(e.target.files?.[0])}
            />
          </label>
        )
      ) : null}

      {error ? (
        <p role="alert" className="-mt-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col gap-2">
        <Label htmlFor="upload-title">Title</Label>
        <Input
          id="upload-title"
          name="title"
          required
          defaultValue={editing?.title ?? file?.name.replace(/\.pdf$/i, '') ?? ''}
          key={file?.name}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label id="upload-category-label">Category</Label>
        <Select items={categoryItems} value={category} onValueChange={(v) => setCategory(v as CategorySlug)}>
          <SelectTrigger className="h-10! w-full" aria-labelledby="upload-category-label">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categoryItems.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="upload-description">Description</Label>
        <Textarea
          id="upload-description"
          name="description"
          rows={3}
          defaultValue={editing?.description ?? ''}
          placeholder="A short summary shown in search results"
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{editing ? 'Save changes' : 'Upload PDF'}</Button>
      </DialogFooter>
    </form>
  )
}
