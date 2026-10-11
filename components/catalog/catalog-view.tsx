'use client'

import { useMemo, useState } from 'react'
import { FileSearch, LayoutGrid, List, Search, SlidersHorizontal, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DocCard } from '@/components/doc-card'
import { DocListItem } from '@/components/doc-list-item'
import { CatalogFilters, type Filters } from '@/components/catalog/catalog-filters'
import {
  categories,
  daysAgo,
  documents,
  getCategory,
  getFileType,
  type CategorySlug,
} from '@/lib/data'
import { cn } from '@/lib/utils'

type Sort = 'newest' | 'downloads'
const sortItems = [
  { value: 'newest', label: 'Newest first' },
  { value: 'downloads', label: 'Most downloaded' },
]

export function CatalogView({
  initialQuery,
  initialCategories,
  initialSort,
}: {
  initialQuery: string
  initialCategories: CategorySlug[]
  initialSort: Sort
}) {
  const [query, setQuery] = useState(initialQuery)
  const [sort, setSort] = useState<Sort>(initialSort)
  const [layout, setLayout] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    categories: initialCategories,
    fileTypes: [],
    date: 'any',
  })

  const searched = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return documents
    return documents.filter((d) =>
      [d.title, d.description, d.author, ...d.tags, getCategory(d.category).name]
        .join(' ')
        .toLowerCase()
        .includes(q),
    )
  }, [query])

  const counts = useMemo(() => {
    const base = Object.fromEntries(categories.map((c) => [c.slug, 0])) as Record<CategorySlug, number>
    for (const d of searched) base[d.category]++
    return base
  }, [searched])

  const results = useMemo(() => {
    return searched
      .filter((d) => filters.categories.length === 0 || filters.categories.includes(d.category))
      .filter((d) => filters.fileTypes.length === 0 || filters.fileTypes.includes(getFileType(d)))
      .filter((d) => filters.date === 'any' || daysAgo(d.uploadedAt) <= Number(filters.date))
      .sort((a, b) => (sort === 'downloads' ? b.downloads - a.downloads : b.uploadedAt.localeCompare(a.uploadedAt)))
  }, [searched, filters, sort])

  const resetFilters = () => setFilters({ categories: [], fileTypes: [], date: 'any' })
  const activeChips = [
    ...filters.categories.map((c) => ({
      key: c,
      label: getCategory(c).name,
      remove: () => setFilters((f) => ({ ...f, categories: f.categories.filter((x) => x !== c) })),
    })),
    ...filters.fileTypes.map((t) => ({
      key: t,
      label: t,
      remove: () => setFilters((f) => ({ ...f, fileTypes: f.fileTypes.filter((x) => x !== t) })),
    })),
  ]

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Document catalog</h1>
        <p className="text-muted-foreground">Search, filter and sort across the entire PDFHub library.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside
          aria-label="Filters"
          className={cn('lg:sticky lg:top-24 lg:block lg:self-start', showFilters ? 'block' : 'hidden')}
        >
          <CatalogFilters filters={filters} counts={counts} onChange={setFilters} onReset={resetFilters} />
        </aside>

        <section aria-label="Results" className="flex min-w-0 flex-col gap-5">
          <div className="flex flex-col gap-3 rounded-xl border bg-card p-3 shadow-sm sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <label htmlFor="catalog-search" className="sr-only">
                Search the catalog
              </label>
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                id="catalog-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search titles, authors, tags…"
                className="h-10 pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="h-10 lg:hidden"
                onClick={() => setShowFilters((s) => !s)}
                aria-expanded={showFilters}
              >
                <SlidersHorizontal aria-hidden="true" />
                Filters
              </Button>
              <Select items={sortItems} value={sort} onValueChange={(v) => setSort(v as Sort)}>
                <SelectTrigger className="h-10! w-44" aria-label="Sort results">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortItems.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="hidden items-center rounded-lg border p-0.5 sm:flex" role="group" aria-label="Layout">
                <Button
                  size="icon"
                  variant={layout === 'grid' ? 'secondary' : 'ghost'}
                  onClick={() => setLayout('grid')}
                  aria-pressed={layout === 'grid'}
                  aria-label="Grid view"
                >
                  <LayoutGrid />
                </Button>
                <Button
                  size="icon"
                  variant={layout === 'list' ? 'secondary' : 'ghost'}
                  onClick={() => setLayout('list')}
                  aria-pressed={layout === 'list'}
                  aria-label="List view"
                >
                  <List />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm">
            <p className="text-muted-foreground" aria-live="polite">
              <span className="font-semibold text-foreground">{results.length}</span>{' '}
              {results.length === 1 ? 'document' : 'documents'}
              {query.trim() ? (
                <>
                  {' for '}
                  <span className="font-semibold text-foreground">{`"${query.trim()}"`}</span>
                </>
              ) : null}
            </p>
            {activeChips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={chip.remove}
                className="flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground hover:bg-secondary/70"
              >
                {chip.label}
                <X className="size-3" aria-hidden="true" />
                <span className="sr-only">Remove filter</span>
              </button>
            ))}
          </div>

          {results.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed bg-card px-6 py-16 text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-muted">
                <FileSearch className="size-6 text-muted-foreground" aria-hidden="true" />
              </span>
              <h2 className="font-semibold">No documents match your search</h2>
              <p className="max-w-sm text-sm text-muted-foreground">
                Try a different keyword or clear some filters to broaden your results.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setQuery('')
                  resetFilters()
                }}
              >
                Reset search
              </Button>
            </div>
          ) : layout === 'grid' ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((doc) => (
                <DocCard key={doc.id} doc={doc} />
              ))}
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {results.map((doc) => (
                <li key={doc.id}>
                  <DocListItem doc={doc} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
