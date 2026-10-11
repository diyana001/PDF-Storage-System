import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, Download, Eye } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { DocThumbnail } from '@/components/doc-thumbnail'
import { DocCard } from '@/components/doc-card'
import { DetailSecondaryActions } from '@/components/detail/detail-secondary-actions'
import {
  documents,
  formatDate,
  formatNumber,
  formatSize,
  getCategory,
  getDocument,
  getFileType,
  savedIds,
} from '@/lib/data'
import { cn } from '@/lib/utils'

export function generateStaticParams() {
  return documents.map((d) => ({ id: d.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const doc = getDocument(id)
  return doc ? { title: doc.title, description: doc.description } : { title: 'Document not found' }
}

export default async function DocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const doc = getDocument(id)
  if (!doc) notFound()

  const category = getCategory(doc.category)
  const related = documents.filter((d) => d.category === doc.category && d.id !== doc.id).slice(0, 4)
  const fallbackRelated = related.length ? related : documents.filter((d) => d.id !== doc.id).slice(0, 4)

  const meta = [
    { label: 'File size', value: formatSize(doc.sizeMb) },
    { label: 'Pages', value: doc.pages.toString() },
    { label: 'Upload date', value: formatDate(doc.uploadedAt) },
    { label: 'File type', value: getFileType(doc) },
    { label: 'Downloads', value: formatNumber(doc.downloads) },
    { label: 'Views', value: formatNumber(doc.views) },
  ]

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-8 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-foreground">Home</Link>
          </li>
          <ChevronRight className="size-3.5" aria-hidden="true" />
          <li>
            <Link href={`/browse?category=${category.slug}`} className="hover:text-foreground">
              {category.name}
            </Link>
          </li>
          <ChevronRight className="size-3.5" aria-hidden="true" />
          <li aria-current="page" className="max-w-[24ch] truncate font-medium text-foreground sm:max-w-none">
            {doc.title}
          </li>
        </ol>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border bg-card p-4 shadow-sm">
            <DocThumbnail doc={doc} size="lg" />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{category.name}</Badge>
              {doc.tags.map((t) => (
                <Badge key={t} variant="outline">{t}</Badge>
              ))}
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">{doc.title}</h1>
            <p className="text-muted-foreground">
              by <span className="font-medium text-foreground">{doc.author}</span>
            </p>
          </div>

          <p className="leading-relaxed text-pretty">{doc.description}</p>

          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-3">
            {meta.map((m) => (
              <div key={m.label} className="flex flex-col gap-1 bg-card p-4">
                <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{m.label}</dt>
                <dd className="font-semibold">{m.value}</dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/reader/${doc.id}`}
              className={cn(buttonVariants({ size: 'lg' }), 'h-12 flex-1 text-base')}
            >
              <Eye aria-hidden="true" />
              View PDF Online
            </Link>
            <a
              href={`/api/documents/${doc.id}/download`}
              download
              className={cn(
                buttonVariants({ size: 'lg' }),
                'h-12 flex-1 bg-success text-base text-success-foreground hover:bg-success/90',
              )}
            >
              <Download aria-hidden="true" />
              Download PDF
            </a>
          </div>

          <DetailSecondaryActions docId={doc.id} initiallySaved={savedIds.includes(doc.id)} />
        </div>
      </div>

      <section aria-labelledby="related-heading" className="flex flex-col gap-5">
        <h2 id="related-heading" className="text-xl font-semibold tracking-tight sm:text-2xl">
          Related documents
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {fallbackRelated.map((d) => (
            <DocCard key={d.id} doc={d} />
          ))}
        </div>
      </section>
    </div>
  )
}
