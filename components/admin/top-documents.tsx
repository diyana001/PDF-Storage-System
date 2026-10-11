import Link from 'next/link'
import { documents, formatNumber } from '@/lib/data'
import { CategoryIcon } from '@/components/category-icon'

export function TopDocuments() {
  const top = [...documents].sort((a, b) => b.downloads - a.downloads).slice(0, 5)

  return (
    <section aria-labelledby="top-heading" className="flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 id="top-heading" className="font-semibold">
          Most downloaded
        </h2>
        <Link href="/admin/documents" className="text-sm font-medium text-primary hover:underline">
          View all
        </Link>
      </div>
      <ol className="flex flex-col divide-y">
        {top.map((doc, i) => (
          <li key={doc.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
            <span className="w-4 text-sm font-semibold text-muted-foreground tabular-nums">{i + 1}</span>
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
              <CategoryIcon slug={doc.category} className="size-4" />
            </span>
            <Link href={`/documents/${doc.id}`} className="min-w-0 flex-1 truncate text-sm font-medium hover:text-primary">
              {doc.title}
            </Link>
            <span className="text-sm text-muted-foreground tabular-nums">{formatNumber(doc.downloads)}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}
