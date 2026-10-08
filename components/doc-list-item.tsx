import Link from 'next/link'
import { Download, Eye } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { DocThumbnail } from '@/components/doc-thumbnail'
import { formatDate, formatSize, getCategory, type PdfDocument } from '@/lib/data'
import { cn } from '@/lib/utils'

export function DocListItem({
  doc,
  meta,
  actions,
}: {
  doc: PdfDocument
  meta?: React.ReactNode
  actions?: React.ReactNode
}) {
  return (
    <article className="flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <DocThumbnail doc={doc} size="xs" className="h-16 w-12" />
        <div className="flex min-w-0 flex-col gap-1.5">
          <h3 className="truncate font-semibold">
            <Link href={`/documents/${doc.id}`} className="hover:text-primary">
              {doc.title}
            </Link>
          </h3>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <Badge variant="secondary">{getCategory(doc.category).name}</Badge>
            <span>{formatSize(doc.sizeMb)}</span>
            <span>{doc.pages} pages</span>
            <span>{meta ?? formatDate(doc.uploadedAt)}</span>
          </div>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {actions}
        <Link href={`/reader/${doc.id}`} className={cn(buttonVariants({ variant: 'outline' }), 'h-9')}>
          <Eye aria-hidden="true" />
          View
        </Link>
        <a href={`/api/documents/${doc.id}/download`} download className={cn(buttonVariants(), 'h-9')}>
          <Download aria-hidden="true" />
          Download
        </a>
      </div>
    </article>
  )
}
