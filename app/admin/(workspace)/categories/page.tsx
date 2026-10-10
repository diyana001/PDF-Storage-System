import type { Metadata } from 'next'
import Link from 'next/link'
import { CategoryIcon } from '@/components/category-icon'
import { categories, documents, formatNumber } from '@/lib/data'

export const metadata: Metadata = { title: 'Categories' }

export default function AdminCategoriesPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
        <p className="text-muted-foreground">How documents are organized across the public catalog.</p>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((c) => {
          const downloads = documents.filter((d) => d.category === c.slug).reduce((n, d) => n + d.downloads, 0)
          return (
            <li key={c.slug} className="flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-lg bg-secondary text-primary">
                  <CategoryIcon slug={c.slug} className="size-5" />
                </span>
                <div>
                  <h2 className="font-semibold">{c.name}</h2>
                  <p className="text-sm text-muted-foreground">{c.description}</p>
                </div>
              </div>
              <dl className="grid grid-cols-2 gap-3 rounded-lg bg-muted/50 p-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">Documents</dt>
                  <dd className="text-lg font-semibold tabular-nums">{c.count}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Downloads</dt>
                  <dd className="text-lg font-semibold tabular-nums">{formatNumber(downloads)}</dd>
                </div>
              </dl>
              <Link href={`/browse?category=${c.slug}`} className="text-sm font-medium text-primary hover:underline">
                View in catalog
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
