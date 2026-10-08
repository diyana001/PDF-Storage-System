import Link from 'next/link'
import { Download, Eye, FileText } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { DocThumbnail } from '@/components/doc-thumbnail'
import { formatDate, formatNumber, formatSize, getCategory, type PdfDocument } from '@/lib/data'
import { cn } from '@/lib/utils'

export function DocCard({ doc }: { doc: PdfDocument }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md">
      <Link href={`/documents/${doc.id}`} className="block" tabIndex={-1} aria-hidden="true">
        <DocThumbnail doc={doc} className="transition-transform duration-300 group-hover:scale-[1.02]" />
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="secondary">{getCategory(doc.category).name}</Badge>
          <span className="text-xs text-muted-foreground">{formatDate(doc.uploadedAt)}</span>
        </div>
        <h3 className="line-clamp-2 font-semibold leading-snug text-pretty">
          <Link href={`/documents/${doc.id}`} className="hover:text-primary focus-visible:underline">
            {doc.title}
          </Link>
        </h3>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <FileText className="size-3.5" aria-hidden="true" />
            {formatSize(doc.sizeMb)}
          </span>
          <span className="flex items-center gap-1">
            <Download className="size-3.5" aria-hidden="true" />
            {formatNumber(doc.downloads)}
          </span>
          <span>{doc.pages} pages</span>
        </div>
        <div className="mt-auto grid grid-cols-2 gap-2 pt-1">
          <Link
            href={`/reader/${doc.id}`}
            className={cn(buttonVariants({ variant: 'outline' }), 'h-9')}
          >
            <Eye aria-hidden="true" />
            View
          </Link>
          <a
            href={`/api/documents/${doc.id}/download`}
            download
            className={cn(buttonVariants(), 'h-9')}
          >
            <Download aria-hidden="true" />
            Download
          </a>
        </div>
      </div>
    </article>
  )
}
