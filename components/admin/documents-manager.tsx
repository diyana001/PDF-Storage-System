'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Eye, MoreHorizontal, Pencil, Search, Trash2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CategoryIcon } from '@/components/category-icon'
import { UploadDialog, type UploadedDoc } from '@/components/admin/upload-dialog'
import { categories, documents, formatDate, formatNumber, formatSize, getCategory, type PdfDocument } from '@/lib/data'

const categoryItems = [{ value: 'all', label: 'All categories' }, ...categories.map((c) => ({ value: c.slug, label: c.name }))]

export function DocumentsManager({ openUploadOnLoad }: { openUploadOnLoad: boolean }) {
  const [rows, setRows] = useState<PdfDocument[]>(documents)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [uploadOpen, setUploadOpen] = useState(openUploadOnLoad)
  const [editing, setEditing] = useState<PdfDocument | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows.filter(
      (d) => (category === 'all' || d.category === category) && (!q || d.title.toLowerCase().includes(q)),
    )
  }, [rows, query, category])

  function handleSubmit(data: UploadedDoc) {
    if (editing) {
      setRows((list) => list.map((d) => (d.id === editing.id ? { ...d, ...data } : d)))
    } else {
      const newDoc: PdfDocument = {
        ...documents[0],
        ...data,
        id: `new-${Date.now()}`,
        author: 'PDFHub',
        pages: 1,
        tags: [],
        downloads: 0,
        views: 0,
        uploadedAt: new Date().toISOString().slice(0, 10),
      }
      setRows((list) => [newDoc, ...list])
    }
    setEditing(null)
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manage documents</h1>
          <p className="text-muted-foreground">{rows.length} documents in the library</p>
        </div>
        <Button
          className="h-10 gap-2 px-4"
          onClick={() => {
            setEditing(null)
            setUploadOpen(true)
          }}
        >
          <Upload aria-hidden="true" />
          Upload New PDF
        </Button>
      </div>

      <section className="overflow-hidden rounded-xl border bg-card shadow-sm" aria-label="Documents">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <label htmlFor="doc-filter" className="sr-only">
              Filter documents by title
            </label>
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              id="doc-filter"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by title…"
              className="h-10 pl-9"
            />
          </div>
          <Select items={categoryItems} value={category} onValueChange={(v) => setCategory(v as string)}>
            <SelectTrigger className="h-10! w-full sm:w-52" aria-label="Filter by category">
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

        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="pl-4">Document</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Size</TableHead>
              <TableHead className="text-right">Downloads</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead className="pr-4 text-right">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="pl-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-8 shrink-0 items-center justify-center rounded border bg-background text-[9px] font-bold text-destructive">
                      PDF
                    </span>
                    <div className="min-w-0">
                      <p className="max-w-64 truncate font-medium">{doc.title}</p>
                      <p className="text-xs text-muted-foreground">{doc.pages} pages</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                    <CategoryIcon slug={doc.category} className="size-3.5" />
                    {getCategory(doc.category)?.name}
                  </span>
                </TableCell>
                <TableCell className="text-right text-muted-foreground tabular-nums">{formatSize(doc.sizeMb)}</TableCell>
                <TableCell className="text-right tabular-nums">{formatNumber(doc.downloads)}</TableCell>
                <TableCell className="text-muted-foreground">{formatDate(doc.uploadedAt)}</TableCell>
                <TableCell className="pr-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={<Button variant="ghost" size="icon" aria-label={`Actions for ${doc.title}`} />}
                    >
                      <MoreHorizontal />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem render={<Link href={`/documents/${doc.id}`} />}>
                        <Eye aria-hidden="true" /> View
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setEditing(doc)
                          setUploadOpen(true)
                        }}
                      >
                        <Pencil aria-hidden="true" /> Edit details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => setRows((list) => list.filter((d) => d.id !== doc.id))}
                      >
                        <Trash2 aria-hidden="true" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                  No documents match your filters.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </section>

      <UploadDialog
        open={uploadOpen}
        onOpenChange={(open) => {
          setUploadOpen(open)
          if (!open) setEditing(null)
        }}
        editing={editing}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
