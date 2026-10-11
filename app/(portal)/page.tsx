import { Hero } from '@/components/home/hero'
import { CategoryGrid } from '@/components/home/category-grid'
import { SectionHeading } from '@/components/home/section-heading'
import { DocCard } from '@/components/doc-card'
import { documents } from '@/lib/data'

export default function HomePage() {
  const trending = [...documents].sort((a, b) => b.downloads - a.downloads).slice(0, 4)
  const recent = [...documents].sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt)).slice(0, 8)

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 py-8 sm:px-6 lg:px-8">
      <Hero />
      <CategoryGrid />

      <section aria-labelledby="trending-heading" className="flex flex-col gap-5">
        <SectionHeading
          id="trending-heading"
          title="Trending this week"
          description="The most downloaded documents across PDFHub."
          href="/browse?sort=downloads"
          linkLabel="View all"
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {trending.map((doc) => (
            <DocCard key={doc.id} doc={doc} />
          ))}
        </div>
      </section>

      <section aria-labelledby="recent-heading" className="flex flex-col gap-5">
        <SectionHeading
          id="recent-heading"
          title="Recently added"
          description="Fresh uploads from our editors."
          href="/browse"
          linkLabel="Browse catalog"
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {recent.map((doc) => (
            <DocCard key={doc.id} doc={doc} />
          ))}
        </div>
      </section>
    </div>
  )
}
