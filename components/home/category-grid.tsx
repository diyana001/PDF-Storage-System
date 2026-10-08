import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { categories } from '@/lib/data'
import { CategoryIcon, categoryTone, toneClasses } from '@/components/category-icon'
import { SectionHeading } from '@/components/home/section-heading'
import { cn } from '@/lib/utils'

export function CategoryGrid() {
  return (
    <section aria-labelledby="categories-heading" className="flex flex-col gap-5">
      <SectionHeading id="categories-heading" title="Browse by category" href="/browse" linkLabel="All categories" />
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {categories.map((cat) => {
          const tone = toneClasses[categoryTone[cat.slug]]
          return (
            <li key={cat.slug}>
              <Link
                href={`/browse?category=${cat.slug}`}
                className="group flex h-full flex-col gap-4 rounded-xl border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
              >
                <span className={cn('flex size-11 items-center justify-center rounded-lg', tone.soft)}>
                  <CategoryIcon slug={cat.slug} className={cn('size-5', tone.text)} />
                </span>
                <span className="flex flex-col gap-1">
                  <span className="font-semibold">{cat.name}</span>
                  <span className="text-sm text-muted-foreground">{cat.count} documents</span>
                </span>
                <ArrowRight
                  className="mt-auto size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary"
                  aria-hidden="true"
                />
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
