'use client'

import { ChevronDown } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { categories, fileTypes, type CategorySlug, type FileType } from '@/lib/data'

export const dateOptions = [
  { value: 'any', label: 'Any time' },
  { value: '7', label: 'Past 7 days' },
  { value: '30', label: 'Past 30 days' },
  { value: '90', label: 'Past 90 days' },
] as const
export type DateFilter = (typeof dateOptions)[number]['value']

export type Filters = {
  categories: CategorySlug[]
  fileTypes: FileType[]
  date: DateFilter
}

function toggle<T>(list: T[], value: T) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Collapsible defaultOpen className="border-b py-4 last:border-b-0">
      <CollapsibleTrigger className="group flex w-full items-center justify-between rounded-md text-sm font-semibold outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
        {title}
        <ChevronDown className="size-4 text-muted-foreground transition-transform group-data-[panel-open]:rotate-180" aria-hidden="true" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="flex flex-col gap-3 pt-3">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export function CatalogFilters({
  filters,
  counts,
  onChange,
  onReset,
}: {
  filters: Filters
  counts: Record<CategorySlug, number>
  onChange: (next: Filters) => void
  onReset: () => void
}) {
  const active = filters.categories.length + filters.fileTypes.length + (filters.date !== 'any' ? 1 : 0)

  return (
    <div className="rounded-xl border bg-card px-5 py-2 shadow-sm">
      <div className="flex items-center justify-between border-b py-3">
        <h2 className="font-semibold">Filters</h2>
        <button
          type="button"
          onClick={onReset}
          disabled={active === 0}
          className="text-sm font-medium text-primary hover:underline disabled:pointer-events-none disabled:text-muted-foreground"
        >
          Clear all
        </button>
      </div>

      <FilterGroup title="Categories">
        {categories.map((cat) => (
          <label key={cat.slug} className="flex cursor-pointer items-center gap-3 text-sm">
            <Checkbox
              checked={filters.categories.includes(cat.slug)}
              onCheckedChange={() => onChange({ ...filters, categories: toggle(filters.categories, cat.slug) })}
            />
            <span className="flex-1">{cat.name}</span>
            <span className="text-xs text-muted-foreground tabular-nums">{counts[cat.slug]}</span>
          </label>
        ))}
      </FilterGroup>

      <FilterGroup title="File type">
        {fileTypes.map((type) => (
          <label key={type} className="flex cursor-pointer items-center gap-3 text-sm">
            <Checkbox
              checked={filters.fileTypes.includes(type)}
              onCheckedChange={() => onChange({ ...filters, fileTypes: toggle(filters.fileTypes, type) })}
            />
            {type}
          </label>
        ))}
      </FilterGroup>

      <FilterGroup title="Upload date">
        <div role="radiogroup" aria-label="Upload date" className="flex flex-col gap-3">
          {dateOptions.map((opt) => (
            <label key={opt.value} className="flex cursor-pointer items-center gap-3 text-sm">
              <input
                type="radio"
                name="date-filter"
                value={opt.value}
                checked={filters.date === opt.value}
                onChange={() => onChange({ ...filters, date: opt.value })}
                className="size-4 accent-primary"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </FilterGroup>
    </div>
  )
}
