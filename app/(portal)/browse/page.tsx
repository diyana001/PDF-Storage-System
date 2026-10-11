import type { Metadata } from 'next'
import { CatalogView } from '@/components/catalog/catalog-view'
import { categories, type CategorySlug } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Browse documents',
  description: 'Search and filter the PDFHub catalog by category, file type and upload date.',
}

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; sort?: string }>
}) {
  const { q = '', category, sort } = await searchParams
  const initialCategories = categories.some((c) => c.slug === category) ? [category as CategorySlug] : []
  const initialSort = sort === 'downloads' ? 'downloads' : 'newest'

  return (
    <CatalogView
      key={`${q}|${category ?? ''}|${initialSort}`}
      initialQuery={q}
      initialCategories={initialCategories}
      initialSort={initialSort}
    />
  )
}
